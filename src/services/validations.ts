export default class Validations {
  static checkEmailFormat(email: string): boolean {
    const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  static checkRequired(data: string): boolean {
    return data.length > 0
  }
}
