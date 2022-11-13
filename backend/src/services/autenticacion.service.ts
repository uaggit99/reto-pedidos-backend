import { PersonaRepository } from './../repositories/persona.repository';
import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {Persona} from '../models';
const generator = require("password-generator");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(PersonaRepository)
    public personaRepository: PersonaRepository
  ) { }

  /*
   * Add service methods here
   */
  GenerarClave() {
    let clave = generator(8, false);
    return clave;
  }
  CifrarClave(clave: string) {
    let ClaveCifrada = cryptoJs.MD5(clave).toString();
    return ClaveCifrada;
  }
  IdentificarPersona(usuario: string, clave: string) {
    try {
      let p = this.personaRepository.findOne({where: {correo: usuario, clave: clave}});
      if (p) {
        return p;
      }
      return false;

    } catch {
      return false;

    }
  }

  GenerarTokenJWT(persona: Persona) {

    let token = jwt.sign({
      data: {
        id: persona.id,
        correo: persona.correo,
        nombre: persona.nombres + " " + persona.apellidos

      }

    },
      Llaves.claveJWT);
    return token;

  }
  ValidarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;

    } catch {
      return false;


    }

  }
}
