import { useState } from "react";
import { Button } from "../components/ui/button";

export default function Profile() {
  const [name, setname] = useState("");
  const [occupation, setoccupation] = useState("");
  const [preferences, setpreferences] = useState("");
  const [traits, settraits] = useState("");
  const token = localStorage.getItem("token");

  const handleclick = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        occupation,
        preferences,
        traits,
      }),
    });
    return <div>submitted</div>;
  };

  return (
    <div className="space-y-20 gap-10 max-w-7xl ">
      <div className="">customization</div>
      <div>{name}</div>
      

      <div className="">
        <div>
          name
          <input
            placeholder="name"
            type="text"
            value={name}
            onChange={(e) => {
              setname(e.target.value);
            }}
          />
        </div>
        <div>
          profession
          <input
            placeholder="occupation"
            type="text"
            value={occupation}
            onChange={(e) => {
              setoccupation(e.target.value);
            }}
          />
        </div>
        <div>
          what traits should novachat have
          <input
            placeholder="traits"
            type="text"
            value={traits}
            onChange={(e) => {
              settraits(e.target.value);
            }}
          />
        </div>
        <div>
          anything else novachat should know about 
          <input
            placeholder="preferences"
            type="text"
            value={preferences}
            onChange={(e) => {
              setpreferences(e.target.value);
            }}
          />
        </div>
      </div>

      <Button
        onClick={() => {
          handleclick();
        }}
      >
        add profile
      </Button>
    </div>
  );
}
