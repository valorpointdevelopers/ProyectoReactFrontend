// src/db.ts
import Dexie, { Table } from 'dexie';
import { Message, Chat } from './types'; // Ahora también importamos Chat

export class MySubClassedDexie extends Dexie {
  messages!: Table<Message>; 
  // NUEVO: Añadimos una tabla para los chats
  chats!: Table<Chat>;

  constructor() {
    super('sistemacrm');
    
    // MODIFICADO: Incrementamos la versión a 2 para añadir la nueva tabla
    this.version(2).stores({
      messages: 'msgId, chatId',
      // NUEVO: Definimos la tabla de chats. '&jid' es la clave primaria.
      chats: '&jid, unreadCount'
    });
  }
}

export const db = new MySubClassedDexie();