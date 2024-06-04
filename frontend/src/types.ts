export type Data = Array<Record<string, string>>

export type ApiUploadResponse = {
    message: string,
    data: Data
}

export type ApiSearchResponse = {
    data: Data
}

export type ApiSwitchResponse = {
    message: string,
    data: string
}