import { describe, expect, it } from "vitest";
import { CreateRea } from "./create-rea";
import { Rea } from "../entities/rea";

describe('Create Rea', () => {
    it('should be able to create a Rea', () => {
        const createRea = new CreateRea()

        expect (CreateRea.execute({
            id: 1,
            title: "Consulta de Coisarada dos Negócios",
            thumb: "./c/c/w/w/w/w",
            likesCount: 100,
            reaType: "Exemplo",
            knowledgeArea: "Exemplo",
            license: "Exemplo",
            target: "Exemplo",
            language: "Exemplo",
            description: "Exemplo",
            instructions: "Exemplo"
        })).resolves.toBeInstanceOf(Rea)
    })
})
