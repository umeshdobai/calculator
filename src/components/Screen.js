import React from "react";
import "./Screen.css";

const Screen = ({ value, history }) => {
    console.log(history);
    return (
        <>
            {history[history.length - 1] === "=" && (
                <div>
                    {history[history.length - 3]}
                    {history[history.length - 2]}
                </div>
            )}
            <div className="screen">{value}</div>
        </>
    );
};

export default Screen;
