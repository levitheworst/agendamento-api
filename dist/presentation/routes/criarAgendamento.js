"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const CriarAgendamento_1 = __importDefault(require("../../app/usecases/CriarAgendamento"));
const supabase_GatewayUsuario_1 = __importDefault(require("../../app/gateways/supabase.GatewayUsuario"));
const supabase_GatewayHorario_1 = __importDefault(require("../../app/gateways/supabase.GatewayHorario"));
const supabase_GatewayAgendamento_1 = __importDefault(require("../../app/gateways/supabase.GatewayAgendamento"));
const router = (0, express_1.Router)();
const gatewayUsuario = new supabase_GatewayUsuario_1.default();
const gatewayAgendamento = new supabase_GatewayAgendamento_1.default();
const gatewayHorario = new supabase_GatewayHorario_1.default();
const criarAgendamento = new CriarAgendamento_1.default(gatewayUsuario, gatewayHorario, gatewayAgendamento);
router.use(express_1.default.json());
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telefone, dataMarcada } = req.body;
        const agendamentoCriado = yield criarAgendamento.execute({ telefone }, { dataMarcada });
        res.status(201).json(agendamentoCriado);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Erro desconhecido" });
        }
    }
}));
exports.default = router;
