export interface ReaProps {
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

export class Rea {
    private props: ReaProps

    get id () {
        return this.props.id
    }

    get title () {
        return this.props.title
    }

    get thumb() {
        return this.props.thumb
    }

    get likesCount () {
        return this.props.likesCount
    }

    get reaType () {
        return this.props.reaType
    }

    get knowledgeArea () {
        return this.props.knowledgeArea
    }

    get license () {
        return this.props.license
    }

    get target () {
        return this.props.target
    }

    get language () {
        return this.props.language
    }

    get description () {
        return this.props.description
    }

    get instructions() {
        return this.props.instructions
    }

    constructor(props: ReaProps){
        this.props = props; 
    }
}
