import { SAMPLE_FORM } from "./form";
import React, { useState } from "react";
import { set, useFieldArray, useForm } from "react-hook-form";
import { getValidationObject } from "./getValidationObject";
import { zodResolver } from "@hookform/resolvers/zod";
function App() {
  const formData = SAMPLE_FORM.FORM_1;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getValidationObject(formData)),
  });
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

        return (
          <BuildFields
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
        return (
          <div key={e.name}>
            <label>{e.label}</label>
            <BuildFields
              value={inputFormData ? inputFormData[e.name] : ""}
              onChange={(p) =>
                setInputFormData((oldObj) => ({
                  ...oldObj,
                  [e.name]: p.target.value,
                }))
              }
            />
          </div>
        );
      })}
      <button
        onClick={() => {
          const formData = { ...inputFormData };
          setInputFormData(null);

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
              {props.data.map((e) => (
                <BuildFields
                  {...e}
                  key={e.name}
                  {...props.registerForm(`${props.name}.${idx}.${e.name}`)}
                  error={errors[`${props.name}`]?.at(idx)[e.name]}
                />
              ))}
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
  return (
    <div>
      <label>{props.label}</label>
      <input {...props} ref={ref} />
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
