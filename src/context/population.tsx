import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Voluntario, voluntarioClient } from "../services/voluntarioClient";
import { Avaliacao, avaliacaoClient } from "../services/avaliacaoClient";

type MeanType = {
    rfc: number
    iacap: number
    if_value: number
    pse: number
    power: number
}

type PopulationContextType = {
    all_volunteers: Voluntario[]
    all_assessments: Avaliacao[]
    means: MeanType
}

let initial_means_value = {
    iacap: 0,
    if_value: 0,
    power: 0,
    pse: 0,
    rfc: 0
}

export const PopulationContext = createContext<PopulationContextType>({
    all_assessments: [],
    all_volunteers: [],
    means: initial_means_value
})

async function getAllVolunteers(){
    let volunteers = await voluntarioClient.list()
    
    return volunteers
}

async function getAllAssessments(volunteers: Voluntario[]) {
    const assessments: Avaliacao[] = [];
    
    await Promise.all(
        volunteers.map(async (v) => {
            if (v.id) {
                const a = await avaliacaoClient.listByVoluntario(v.id);
                if (a[0]) assessments.push(a[0])
            }
        })
    );

    return assessments
}

type PopulationContextProviderProps = { children: ReactNode };

const PopulationContextProvider: React.FC<PopulationContextProviderProps> = ({children}) => {
    const [meanValue, setMeanValue] = useState(initial_means_value)
    const [allVolunteers, setAllVolunteers] = useState<Voluntario[]>([])
    const [allAssessments, setAllAssessments] = useState<Avaliacao[]>([])


    useEffect(() => {
        (async () => {
          const volunteers = await getAllVolunteers();
          setAllVolunteers(volunteers);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const assessments = await getAllAssessments(allVolunteers);
            setAllAssessments(assessments);
          
            const keyMap: Record<string, keyof MeanType | keyof Avaliacao> = {
                iacap: "iacap",
                if_value: "if_valor",
                power: "potencia",
                rfc: "rfc",
                pse: "pse",
            };
        
            const sums = Object.fromEntries(
                Object.keys(keyMap).map((k) => [k, { total: 0, count: 0 }])
            ) as Record<string, { total: number; count: number }>;
    
            for (const a of assessments) {
                for (const [ctxKey, modelKey] of Object.entries(keyMap)) {
                    const value = (a as any)[modelKey] ?? 0;
                    sums[ctxKey].total += value;
                    sums[ctxKey].count++;
                }
            }
          
            const averages = Object.fromEntries(
                Object.entries(sums).map(([k, v]) => [k, v.total / (v.count || 1)])
            ) as MeanType;
        
            setMeanValue(averages);
          })();
    }, [allVolunteers.length])

    return (
        <PopulationContext.Provider value = {{
            all_volunteers: allVolunteers,
            all_assessments: allAssessments,
            means: meanValue
        }}>
            {children}
        </PopulationContext.Provider>
    )
}

export default PopulationContextProvider