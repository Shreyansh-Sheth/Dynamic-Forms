import { SAMPLE_FORM } from "./form";
import React, { useEffect, useState } from "react";
import { set, useFieldArray, useForm } from "react-hook-form";
import { getValidationObject } from "./getValidationObject";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function accessDeepProp(obj, path) {
  if (!path) return obj;
  const properties = path.split(".");
  return accessDeepProp(obj[properties.shift()], properties.join("."));
}

function App() {
  const formData = SAMPLE_FORM.FORM_1;
  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getValidationObject(formData)),
  });
  console.log(errors);
  const logData = handleSubmit((data) => {
    console.log("FORM SUBMITTED");
    console.log(data);
  });
  return (
    <form onSubmit={logData}>
      {formData.map((item, idx) => {
        if (item.type === "array") {
          return (
            <BuildArray
              control={control}
              key={idx + item.name}
              registerForm={register}
              data={item.data}
              errors={errors}
              {...item}
            />
          );
        }

        if (item.type === "block") {
          return (
            <div
              style={{
                border: "1px solid black",
                margin: "10px",
              }}
            >
              <p>{item.name}</p>
              <hr />
              {item.data.map((e) => {
                let error;
                try {
                  error = errors[item.name][e.name];
                } catch {}

                return (
                  <BuildFields
                    watch={watch}
                    error={error}
                    control={control}
                    key={idx + e.name}
                    {...e}
                    {...register(item.name + "." + e.name)}
                  />
                );
              })}
            </div>
          );
        }

        return (
          <BuildFields
            watch={watch}
            control={control}
            key={idx + item.name}
            {...item}
            {...register(item.name)}
            error={errors[item.name]}
          />
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
}

const BuildArray = (props) => {
  const { errors } = props;
  const { insert, remove, fields, update } = useFieldArray({
    control: props.control,
    name: props.name,
  });
  const [inputFormData, setInputFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFieldIndex, setEditFieldIndex] = useState(null);
  const [localError, setLocalError] = useState({});

  return (
    <div>
      <p>{props.name}</p>

      {/* ERROR IF FORM FIELDS NOT MATCH */}
      {errors[props.name] && (
        <p
          style={{
            color: "red",
          }}
        >
          {errors[props.name].message}
        </p>
      )}
      {/* FORM ON TOP */}

      {props.data.map((e) => {
        const isHidden =
          e.showIf && inputFormData && inputFormData.hasOwnProperty(e.showIf)
            ? e.showIf && !inputFormData[e.showIf]
            : false;

        return (
          <div key={e.name}>
            <BuildFields
              hidden={isHidden}
              error={localError[e.name]}
              placeholder={e.placeholder}
              type={e.type}
              options={e?.options}
              label={e.label}
              value={
                inputFormData.hasOwnProperty(e.name)
                  ? inputFormData[e.name]
                  : ""
              }
              onChange={(p) => {
                if (e.type === "checkbox") {
                  setInputFormData((oldObj) => ({
                    ...oldObj,
                    [e.name]: p.target.checked,
                  }));
                  return;
                }

                setInputFormData((oldObj) => ({
                  ...oldObj,
                  [e.name]: p.target.value,
                }));
              }}
            />
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          const validation = props.validation;

          const result = validation.element.safeParse(inputFormData);

          if (!result.success) {
            const errors = {};
            result.error.issues.map((e) => {
              errors[e.path[0]] = e;
            });
            console.log(errors);
            setLocalError(errors);
            return;
          }
          setInputFormData({});

          setLocalError({});
          const formData = { ...inputFormData };
          if (!isEditMode) {
            insert(fields.length, formData);
          } else {
            update(editFieldIndex, formData);
            setIsEditMode(false);
            setEditFieldIndex(null);
          }
        }}
      >
        {isEditMode ? "Update" : "Add"}
      </button>
      <div
        style={{
          border: "1px solid black",
        }}
      >
        {/* DYNAMIC ALL FIELD DISPLAY */}
        {fields.map((item, idx) => {
          return (
            <div
              key={item.id}
              style={{
                border: "1px solid black",
                margin: "10px",
                padding: "10px",
              }}
            >
              {props.data.map((e) => {
                const { showIf, ...prop } = e;
                return (
                  <BuildFields
                    disable
                    {...prop}
                    key={e.name}
                    {...props.registerForm(`${props.name}.${idx}.${e.name}`)}
                  />
                );
              })}
              <button type="button" onClick={() => remove(idx)}>
                Delete
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(true);
                  setEditFieldIndex(idx);
                  const { id, ...onlyFields } = item;
                  setInputFormData(onlyFields);
                }}
              >
                Update
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BuildFields = React.forwardRef((props, ref) => {
  console.log(props.hidden);
  const [isHidden, setIsHidden] = useState(props.showIf ? true : false);
  useEffect(() => {
    if (props.showIf && props.watch) {
      props.watch((value, { name }) => {
        if (name === props.showIf) {
          setIsHidden(!accessDeepProp(value, name));
        }
      });
    }
  }, []);
  console.log("ERROR", props.error);

  //This Is For Array Based Fields So We Can Hide Them Without Main Form Data
  if (props.hidden) {
    return <></>;
  }

  return (
    <div
      style={{
        display: isHidden ? "none" : "block",
      }}
    >
      <label>{props.label}</label>
      {["text", "number", "date", "checkbox"].includes(props.type) && (
        <input
          checked={props.value}
          defaultValue={props.defaultValue}
          defaultChecked={props.defaultChecked}
          {...props}
          ref={ref}
        />
      )}
      {props.type === "select" && (
        <select {...props} ref={ref}>
          {props.options.map((e) => {
            return <option value={e.value}>{e.name}</option>;
          })}
        </select>
      )}
      {props.error && (
        <p
          style={{
            color: "red",
          }}
        >
          {props.error.message}
        </p>
      )}
    </div>
  );
});

export default App;
