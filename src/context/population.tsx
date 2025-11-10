import React, { createContext, ReactNode, useEffect, useState } from "react";
import { voluntarioClient } from "../services/voluntarioClient";
import { avaliacaoClient } from "../services/avaliacaoClient";
import { Voluntario } from "../../electron/models/voluntario";
import { Avaliacao } from "../../electron/models/avaliacao";

type MeanType = {
    rfc: number
    iacap: number
    if_value: number
    pse: number
    power: number
    weight: number
    height: number
}

type PopulationContextType = {
    all_volunteers: Voluntario[]
    all_assessments: Avaliacao[]
    means: MeanType,
    removeVolunteer: (volunteer: Voluntario) => void
    removeAssessment: (assessment: Avaliacao) => void
    addVolunteer: (volunteer: Voluntario) => void
    addAssessment: (assessment: Avaliacao) => void
}

let initial_means_value = {
    iacap: 0,
    if_value: 0,
    power: 0,
    pse: 0,
    rfc: 0,
    weight: 0,
    height: 0
}

export const PopulationContext = createContext<PopulationContextType>({
    all_assessments: [],
    all_volunteers: [],
    means: initial_means_value,
    removeVolunteer: () => null,
    removeAssessment: () => null,
    addVolunteer: () => null,
    addAssessment: () => null
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

function calculateMeans(allVolunteers: Voluntario[], allAssessments: Avaliacao[]){
    if (allVolunteers.length === 0) return initial_means_value;
    const safeAverage = (total: number, count: number) =>
        count > 0 ? total / count : 0;
    
    // ==========================
    // 🔸 MÉDIAS DAS AVALIAÇÕES
    // ==========================
    const assessment_key_map: Record<string, keyof MeanType | keyof Avaliacao> = {
        iacap: "iacap",
        if_value: "if_valor",
        power: "potencia",
        rfc: "rfc",
        pse: "pse",
    };

    const assessment_sums = Object.fromEntries(
        Object.keys(assessment_key_map).map((k) => [k, { total: 0, count: 0 }])
    ) as Record<string, { total: number; count: number }>;

    for (const a of allAssessments) {
        for (const [ctxKey, modelKey] of Object.entries(assessment_key_map)) {
        const value = (a as any)[modelKey] ?? 0;
            assessment_sums[ctxKey].total += value;
            assessment_sums[ctxKey].count++;
        }
    }

    const assessment_means = Object.fromEntries(
        Object.entries(assessment_sums).map(([k, v]) => [k, safeAverage(v.total, v.count)])
    ) as Partial<MeanType>;
    
    // ==========================
    // 🔸 MÉDIAS DOS VOLUNTÁRIOS
    // ==========================
    const volunteer_key_map: Record<string, keyof MeanType | keyof Voluntario> = {
        weight: "peso",
        height: "altura",
    };

    const volunteer_sums = Object.fromEntries(
        Object.keys(volunteer_key_map).map((k) => [k, { total: 0, count: 0 }])
    ) as Record<string, { total: number; count: number }>;

    for (const v of allVolunteers) {
        for (const [ctxKey, modelKey] of Object.entries(volunteer_key_map)) {
        const value = (v as any)[modelKey];
        if (value != null && !isNaN(value)) {
            volunteer_sums[ctxKey].total += value;
            volunteer_sums[ctxKey].count++;
        }
        }
    }

    const volunteer_means = Object.fromEntries(
        Object.entries(volunteer_sums).map(([k, v]) => [k, safeAverage(v.total, v.count)])
    ) as Partial<MeanType>;

    //
    // ==========================
    // 🔸 UNE TUDO E SALVA
    // ==========================
    //
    const all_means = {
        ...assessment_means,
        ...volunteer_means,
    } as MeanType;

    return all_means
}

type PopulationContextProviderProps = { children: ReactNode };

const PopulationContextProvider: React.FC<PopulationContextProviderProps> = ({children}) => {
    const [meanValue, setMeanValue] = useState(initial_means_value)
    const [allVolunteers, setAllVolunteers] = useState<Voluntario[]>([])
    const [allAssessments, setAllAssessments] = useState<Avaliacao[]>([])

    const addVolunteer = (volunteer: Voluntario) => {
        setAllVolunteers(previous_state => [...previous_state, volunteer])
    }

    const removeVolunteer = (volunteer: Voluntario) => {
        setAllVolunteers(previous_state => previous_state.filter(v => v.id !== volunteer.id))
    }

    const addAssessment = (assessment: Avaliacao) => {
        setAllAssessments(previous_state => [...previous_state, assessment])
    }

    const removeAssessment = (assessment: Avaliacao) => {
        setAllAssessments(previous_state => previous_state.filter(a => a.id !== assessment.id))
    }

    useEffect(() => {
        (async () => {
          const volunteers = await getAllVolunteers();
          setAllVolunteers(volunteers);

          const assessments = await getAllAssessments(volunteers);
            setAllAssessments(assessments);

            const means = calculateMeans(volunteers, assessments)
            setMeanValue(means)
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const means = calculateMeans(allVolunteers, allAssessments)
            setMeanValue(means);
        })();
    }, [allVolunteers, allAssessments])

    return (
        <PopulationContext.Provider value = {{
            all_volunteers: allVolunteers,
            all_assessments: allAssessments,
            means: meanValue,
            addAssessment,
            addVolunteer,
            removeAssessment,
            removeVolunteer
        }}>
            {children}
        </PopulationContext.Provider>
    )
}

export default PopulationContextProvider