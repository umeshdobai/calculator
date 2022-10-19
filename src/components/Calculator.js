import React, { useEffect, useState } from "react";
import Button from "./Button";
import ButtonBox from "./ButtonBox";
import Screen from "./Screen";
import Wrapper from "./Wrapper";

const Calculator = () => {
    const btnValues = [
        ["CE", "C", "<--", "/"],
        [7, 8, 9, "X"],
        [4, 5, 6, "-"],
        [1, 2, 3, "+"],
        ["+/-", 0, ".", "="],
    ];

    const [stackHistory, setstackHistory] = useState([]);

    const [calc, setCalc] = useState({
        sign: "",
        num: 0,
        res: 0,
    });

    const toLocaleString = (num) =>
        String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

    const removeSpaces = (num) => num.toString().replace(/\s/g, "");

    const resetHandler = () => {
        setstackHistory([]);
        setCalc({
            ...calc,
            sign: "",
            num: 0,
            res: 0,
        });
    };

    const invertClickhandler = () => {
        setCalc({
            ...calc,
            num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
            res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
            sign: "",
        });
    };

    const percentClickHandler = () => {
        let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
        let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

        setCalc({
            ...calc,
            num: (num /= Math.pow(100, 1)),
            res: (res /= Math.pow(100, 1)),
            sign: "",
        });
    };

    const equalsClickHandler = () => {
        setstackHistory([...stackHistory, "="]);
        if (calc.sign && calc.num) {
            const math = (a, b, sign) =>
                sign === "+"
                    ? a + b
                    : sign === "-"
                    ? a - b
                    : sign === "X"
                    ? a * b
                    : a / b;

            setCalc({
                ...calc,
                res:
                    calc.num === "0" && calc.sign === "/"
                        ? "Can't divide with 0"
                        : toLocaleString(
                              math(
                                  Number(removeSpaces(calc.res)),
                                  Number(removeSpaces(calc.num)),
                                  calc.sign
                              )
                          ),
                sign: "",
                num: 0,
            });
        }
    };

    const signClickhandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setstackHistory([...stackHistory, value]);
        setCalc({
            ...calc,
            sign: value,
            res: !calc.res && calc.num ? calc.num : calc.res,
            num: 0,
        });
    };

    const commaClickhandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc({
            ...calc,
            num: !calc.num.toString().includes(".")
                ? calc.num + value
                : calc.num,
        });
    };

    const numClickhandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        if (
            stackHistory[stackHistory.length - 1] === "+" ||
            stackHistory[stackHistory.length - 1] === "-" ||
            stackHistory[stackHistory.length - 1] === "X" ||
            stackHistory[stackHistory.length - 1] === "/"
        ) {
            setstackHistory([...stackHistory, value]);
        } else {
            if (stackHistory.length === 0) {
                setstackHistory([stackHistory + value]);
            } else {
                setstackHistory([
                    stackHistory[stackHistory.length - 1] + value,
                ]);
            }
        }
        if (removeSpaces(calc.num).length < 16) {
            setCalc({
                ...calc,
                num:
                    calc.num === 0 && value === "0"
                        ? "0"
                        : removeSpaces(calc.num) % 1 === 0
                        ? toLocaleString(Number(removeSpaces(calc.num + value)))
                        : toLocaleString(calc.num + value),
                res: !calc.sign ? 0 : calc.res,
            });
        }
    };

    return (
        <Wrapper>
            <Screen
                value={calc.num ? calc.num : calc.res}
                history={stackHistory}
            />
            <ButtonBox>
                {btnValues.flat().map((btn, i) => {
                    return (
                        <Button
                            key={i}
                            className={btn === "=" ? "equals" : ""}
                            value={btn}
                            onClick={
                                btn === "C"
                                    ? resetHandler
                                    : btn === "+/-"
                                    ? invertClickhandler
                                    : btn === "%"
                                    ? percentClickHandler
                                    : btn === "="
                                    ? equalsClickHandler
                                    : btn === "/" ||
                                      btn === "X" ||
                                      btn === "-" ||
                                      btn === "+"
                                    ? signClickhandler
                                    : btn === "."
                                    ? commaClickhandler
                                    : numClickhandler
                            }
                        />
                    );
                })}
            </ButtonBox>
        </Wrapper>
    );
};

export default Calculator;
