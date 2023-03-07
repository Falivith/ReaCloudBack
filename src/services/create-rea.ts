import { Rea } from "../entities/rea";

interface ReaRequest {
    id: number
    title: string
    thumb: string
    likesCount: number
    reaType: string
    knowledgeArea: string
    license: string
    target: string
    language: string
    description: string
    instructions: string
}

type ReaResponse = Rea

export class CreateRea {
    static async execute ({    
        id,
        title,
        thumb,
        likesCount,
        reaType,
        knowledgeArea,
        license,
        target,
        language,
        description,
        instructions
    }: ReaRequest ): Promise < ReaResponse >{
        const rea = new Rea({
            id,
            title,
            thumb,
            likesCount,
            reaType,
            knowledgeArea,
            license,
            target,
            language,
            description,
            instructions
        })

        return rea
    }
}