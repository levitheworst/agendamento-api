import { v4 } from "uuid";

import Agendamento from "../../domain/models/Agendamento";
import Horario from "../../domain/models/Horario";
import IGatewayAgendamento from "../gateways/interfaces/IGatewayAgendamento";
import IGatewayUsuario from "../gateways/interfaces/IGatewayUsuario";
import IGatewayHorario from "../gateways/interfaces/IGatewayHorario";

export default class CriarAgendamento {
  private gatewayUsuario: IGatewayUsuario;
  private gatewayHorario: IGatewayHorario;
  private gatewayAgendamento: IGatewayAgendamento;

  constructor(
    gatewayUsuario: IGatewayUsuario,
    gatewayHorario: IGatewayHorario,
    gatewayAgendamento: IGatewayAgendamento
  ) {
    this.gatewayUsuario = gatewayUsuario;
    this.gatewayHorario = gatewayHorario;
    this.gatewayAgendamento = gatewayAgendamento;
  }

  async execute(
    dadosUsuario: {
      telefone: string;
    },
    dadosAgendamento: {
      dataMarcada: Date;
    }
  ): Promise<Agendamento> {
    const { dataMarcada } = dadosAgendamento;
    const { telefone } = dadosUsuario;

    if (!telefone || !dataMarcada) {
      throw new TypeError("Erro: Parâmetro(s) nulo(s)");
    }

    const usuario = await this.gatewayUsuario.pesquisarUsuarioPorTelefone(
      telefone
    );

    if (!usuario.id) {
      throw new Error(
        "Erro: não foi possível criar agendamento com tal usuário"
      );
    }

    if (
      dataMarcada.getTime() < Date.now() ||
      (dataMarcada.getTime() - Date.now()) / (1000 * 60 * 60 * 24) >= 14
    ) {
      throw new Error("Data indisponível");
    }

    if (!(await this.gatewayAgendamento.verificarDataMarcada(dataMarcada))) {
      throw new Error("Data já marcada por outro cliente");
    }

    if (
      !(await this.gatewayHorario.verificarHorario(
        new Horario(
          null,
          dataMarcada.getDay(),
          dataMarcada.getHours(),
          dataMarcada.getMinutes()
        )
      ))
    ) {
      throw new Error("Data indisponível");
    }

    const id = v4();

    return await this.gatewayAgendamento.criarAgendamento(
      new Agendamento(id, usuario.id, dataMarcada)
    );
  }
}
