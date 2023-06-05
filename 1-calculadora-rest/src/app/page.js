"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const BASE_URL =
  "http://ec2-3-133-82-159.us-east-2.compute.amazonaws.com:3000/calculadora/operacoes/";

export default function Home() {
  const [result, setResult] = useState("");
  const [firstOper, setFirstOper] = useState("");
  const [secondOper, setSecondOper] = useState("");
  const [operation, setOperation] = useState(0);
  const [operations, setOperations] = useState([]);

  useEffect(() => {
    getOperations();
  }, []);

  const getOperations = async () => {
    try {
      const response = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const _operations = data.map((_operation) => {
        return {
          ..._operation,
          label: _operation.endpoint.split("/")[1].toUpperCase(),
        };
      });
      if (_operations.length > 0) {
        setOperation(_operations[0].label);
        setOperations(_operations);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculate = async () => {
    try {
      const selectedOperation = operations.filter(
        (_operation) => _operation.label === operation
      )[0];

      if (!selectedOperation) {
        throw new Error("Operação não encontrada");
      }

      const response = await fetch(
        `${BASE_URL}${selectedOperation.label.toLowerCase()}/${firstOper}/${secondOper}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.value) {
        setResult(data.value);
      } else {
        setResult("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className={styles.main}>
      <p className={styles.header}>AT04 - Calculadora REST</p>
      <p className={styles.title}>Escolha a operação:</p>
      <select
        className={styles.select}
        value={operation}
        onChange={(_target) => setOperation(_target.currentTarget.value)}
      >
        {operations.map((_operation, index) => {
          return (
            <option key={index} value={_operation.label}>
              {_operation.label}
            </option>
          );
        })}
      </select>
      <p className={styles.title}>Agora calcule:</p>
      <input
        name="ftOper"
        placeholder="Primeiro operando"
        type="text"
        className={styles.input}
        value={firstOper}
        onChange={(_target) => setFirstOper(_target.currentTarget.value)}
      />
      <input
        name="scOper"
        placeholder="Segundo operando"
        type="text"
        className={styles.input}
        value={secondOper}
        onChange={(_target) => setSecondOper(_target.currentTarget.value)}
      />
      <button className={styles.button} onClick={calculate}>
        Calcular
      </button>
      <p className={styles.title}>Resultado:</p>
      <input type="text" className={styles.input} disabled value={result} />
    </main>
  );
}
