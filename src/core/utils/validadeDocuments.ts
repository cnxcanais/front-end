export function validateCNPJ(cnpj: string): boolean {
  if (cnpj) {
    // Remove qualquer caracter que não seja número
    cnpj = cnpj.replace(/\D/g, "")

    // Verifica se o CNPJ possui 14 dígitos
    if (cnpj.length !== 14) {
      return false
    }

    // Verifica se todos os dígitos são iguais (ex: 11111111111111)
    if (/^(\d)\1+$/.test(cnpj)) {
      return false
    }

    // Calcula os dois dígitos verificadores
    let soma = 0
    let peso = 2
    let digito1 = 0
    let digito2 = 0

    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpj.charAt(i)) * peso
      peso = peso === 9 ? 2 : peso + 1
    }

    digito1 = soma % 11 < 2 ? 0 : 11 - (soma % 11)

    soma = 0
    peso = 2

    for (let i = 12; i >= 0; i--) {
      soma += parseInt(cnpj.charAt(i)) * peso
      peso = peso === 9 ? 2 : peso + 1
    }

    digito2 = soma % 11 < 2 ? 0 : 11 - (soma % 11)

    // Verifica se os dígitos calculados são iguais aos dígitos informados
    if (
      parseInt(cnpj.charAt(12)) !== digito1 ||
      parseInt(cnpj.charAt(13)) !== digito2
    ) {
      return false
    }

    return true
  }
}

export function validateCPF(cpf: string): boolean {
  if (cpf) {
    cpf = cpf.replace(/[^\d]+/g, "") // Remove todos os caracteres que não são números

    if (cpf == "") return false // Se o CPF estiver vazio, retorna falso

    // Verifica se o CPF tem 11 dígitos
    if (
      cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999"
    ) {
      return false
    }

    // Calcula o primeiro dígito verificador
    let add = 0
    for (let i = 0; i < 9; i++) {
      add += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let rev = 11 - (add % 11)
    if (rev == 10 || rev == 11) {
      rev = 0
    }
    if (rev != parseInt(cpf.charAt(9))) {
      return false
    }

    // Calcula o segundo dígito verificador
    add = 0
    for (let i = 0; i < 10; i++) {
      add += parseInt(cpf.charAt(i)) * (11 - i)
    }
    rev = 11 - (add % 11)
    if (rev == 10 || rev == 11) {
      rev = 0
    }
    if (rev != parseInt(cpf.charAt(10))) {
      return false
    }

    return true // CPF válido
  }
}
