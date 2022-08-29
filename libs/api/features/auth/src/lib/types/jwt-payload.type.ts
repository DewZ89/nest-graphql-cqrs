export type JwtPayload = {
  sub: number
  email: string
}

export type ParsedJwtPayload = {
  id: number
  email: string
}
