import { VoluntarioService } from "./voluntarioService";
import { AvaliacaoService } from "./avaliacaoService";
import { faker } from "@faker-js/faker";

const voluntarioService = new VoluntarioService();
const avaliacaoService = new AvaliacaoService();

const PRACTICE_UNITS = ["meses", "anos"] as const;

function generatePracticeTime() {
  const unit = faker.helpers.arrayElement(PRACTICE_UNITS);
  const value = unit === "meses"
    ? faker.number.int({ min: 1, max: 11 })
    : faker.number.int({ min: 1, max: 25 });

  return `${value} ${unit}`;
}

export async function runSeed() {
  console.log("🌱 Iniciando o processo de seeding via IPC...");

  const NUM_VOLUNTARIOS = 15;
  console.log(`- Criando ${NUM_VOLUNTARIOS} voluntários...`);

  for (let i = 0; i < NUM_VOLUNTARIOS; i++) {
    const nome = faker.person.fullName();
    const apelido = faker.person.firstName();

    const novoVoluntario = await voluntarioService.create({
      nome,
      apelido,
      idade: faker.number.int({ min: 18, max: 50 }),
      tempo_pratica: generatePracticeTime(),
      peso: faker.number.float({ min: 50, max: 120, fractionDigits: 1 }),
      altura: faker.number.float({ min: 1.5, max: 2.0, fractionDigits: 2 }),
      graduacao: faker.helpers.arrayElement([
        "Branca",
        "Amarela",
        "Azul",
        "Verde",
        "Roxa",
      ]),
      genero: faker.helpers.arrayElement(["Masculino", "Feminino"]),
      endereco: faker.location.streetAddress(),
      contato: faker.phone.number(),
    });

    const numAvaliacoes = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < numAvaliacoes; j++) {
      await avaliacaoService.create({
        voluntario_id: novoVoluntario.id!,
        iacap: faker.number.float({ min: 80, max: 120, fractionDigits: 2 }),
        if_valor: faker.number.float({ min: 0.8, max: 1.5, fractionDigits: 2 }),
        potencia: faker.number.int({ min: 200, max: 500 }),
        rfc: faker.number.int({ min: 160, max: 190 }),
        pse: faker.number.int({ min: 5, max: 10 }),
        golpes: faker.number.int({ min: 40, max: 80 }),
      });
    }
  }

  console.log("✅ Seeding concluído com sucesso!");
}

