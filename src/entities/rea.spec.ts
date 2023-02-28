import { expect, test } from 'vitest'
import { Rea } from './rea';

test ('ReaConsult', () => {
    const rea = new Rea({
        id: 1,
        title: "Consulta de Coisarada dos Negócios",
        thumb: "./c/c/w/w/w/w",
        likesCount: 100,
        reaType: "Exemplo",
        knowledgeArea: "Exemplo",
        license: "Exemplo",
        public: "Exemplo",
        language: "Exemplo",
        description: "Exemplo",
        instructions: "Exemplo"
    })

    expect (rea).toBeInstanceOf(Rea)
    expect (rea.id).toEqual(1)   
})
