// src/db.ts

import Dexie, { Table } from 'dexie';
// Asegúrate de que la ruta a tus tipos sea correcta
import { Message } from './types'; 

export class MySubClassedDexie extends Dexie {
  // 'messages' es la propiedad que representará la tabla.
  messages!: Table<Message>; 

  constructor() {
    // El nombre de tu base de datos local
    super('sistemacrm'); 
    
    this.version(1).stores({
      // Definimos la tabla 'messages'
      // '++id' es una clave primaria autoincremental (opcional, pero buena práctica)
      // '&msgId' es una clave primaria única que viene de tu backend
      // 'chatId' es un índice para poder buscar mensajes por chat de forma rápida
      messages: 'msgId, chatId' 
    });
  }
}

export const db = new MySubClassedDexie();