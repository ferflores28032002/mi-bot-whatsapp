const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client();

const users = {}; // Para rastrear el estado de la conversación con cada usuario

client.on("qr", (qr) => {
  console.log("📲 Escanea este código QR en WhatsApp Web:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Bot conectado y funcionando.");
});

client.on("message", async (message) => {
  const chatId = message.from;
  const text = message.body.trim().toLowerCase();

  console.log(`📩 Mensaje de ${chatId}: ${text}`);

  // Si el usuario ya finalizó la conversación, no responder más
  if (users[chatId]?.step === "finalizado") {
    return;
  }

  // Si es la primera interacción, enviamos el mensaje de bienvenida
  if (!users[chatId]) {
    users[chatId] = { step: "menu" }; // Inicializamos el estado del usuario
    await message.reply(
      "👋 ¡Hola! Somos *CCTV Soluciones*, especialistas en *tecnología y ventas de cámaras de seguridad*.\n\n🔹 ¿En qué podemos ayudarte? Responde con un número:\n\n" +
        "1️⃣ Ver precios de nuestros productos 📊\n" +
        "2️⃣ Conocer nuestros modelos de cámaras 📸\n" +
        "3️⃣ Contactar con un asesor humano 👨‍💼\n" +
        "4️⃣ Ver nuestras promociones 🎉\n\n" +
        "Escribe el número de la opción que te interesa."
    );
    return;
  }

  // Lógica para el menú principal
  if (users[chatId].step === "menu") {
    switch (text) {
      case "1":
        users[chatId].step = "precios";
        await message.reply(
          "📊 Nuestros precios van desde *$50 hasta $500* dependiendo del modelo y funciones.\n\n" +
            "🔹 ¿Te gustaría ver el catálogo completo? (Responde *Sí* o *No*)"
        );
        return;

      case "2":
        users[chatId].step = "modelos";
        await message.reply(
          "📸 Contamos con cámaras de *seguridad HD, visión nocturna y detección de movimiento*.\n\n" +
            "🔹 ¿Quieres ver detalles de un modelo en específico? (Responde *Sí* o *No*)"
        );
        return;

      case "3":
        await message.reply(
          "👨‍💼 Te conectaremos con un asesor en unos minutos. Gracias por comunicarte con *CCTV Soluciones*."
        );
        users[chatId].step = "finalizado"; // Finalizamos la conversación con este usuario
        return;

      case "4":
        users[chatId].step = "promociones";
        await message.reply(
          "🎉 Actualmente tenemos *10% de descuento* en cámaras con detección de movimiento.\n\n" +
            "🔹 ¿Te gustaría recibir un código de descuento exclusivo? (Responde *Sí* o *No*)"
        );
        return;

      default:
        await message.reply(
          "⚠️ Opción no válida. Por favor, elige un número del menú principal."
        );
        return;
    }
  }

  // Respuestas según la opción elegida
  if (users[chatId].step === "precios") {
    if (text === "sí" || text === "si") {
      await message.reply(
        "📜 Aquí tienes nuestro catálogo: [www.cctvsoluciones.com/catalogo](#)\n\n🔹 ¿Necesitas ayuda con algo más? (Escribe *Menú* para volver al inicio)"
      );
    } else {
      await message.reply(
        "✅ Entendido. Si necesitas más información, escribe *Menú* para volver al inicio."
      );
    }
    users[chatId].step = "menu";
    return;
  }

  if (users[chatId].step === "modelos") {
    if (text === "sí" || text === "si") {
      await message.reply(
        "📷 Disponemos de:\n1️⃣ Cámara HD 1080p\n2️⃣ Cámara con visión nocturna\n3️⃣ Cámara con detección de movimiento\n\n🔹 Responde con el número del modelo que quieres conocer."
      );
      users[chatId].step = "detalle_modelo";
    } else {
      await message.reply(
        "✅ No hay problema. Si necesitas más información, escribe *Menú* para volver al inicio."
      );
      users[chatId].step = "menu";
    }
    return;
  }

  if (users[chatId].step === "detalle_modelo") {
    switch (text) {
      case "1":
        await message.reply(
          "📹 La *Cámara HD 1080p* tiene alta definición y conexión Wi-Fi. Precio: $120."
        );
        break;
      case "2":
        await message.reply(
          "🌙 La *Cámara con visión nocturna* permite ver en la oscuridad con gran claridad. Precio: $180."
        );
        break;
      case "3":
        await message.reply(
          "🚨 La *Cámara con detección de movimiento* envía alertas en tiempo real a tu celular. Precio: $250."
        );
        break;
      default:
        await message.reply(
          "⚠️ Opción no válida. Escribe el número correcto o *Menú* para volver al inicio."
        );
        return;
    }
    await message.reply(
      "🔹 ¿Quieres comprar este modelo? (Responde *Sí* o *No*)"
    );
    users[chatId].step = "comprar";
    return;
  }

  if (users[chatId].step === "promociones") {
    if (text === "sí" || text === "si") {
      await message.reply(
        "🎁 ¡Aquí tienes un código de *10% de descuento*: *PROMO10* 🎊\n\n🔹 Usa este código en nuestra web: [www.cctvsoluciones.com](#)"
      );
    } else {
      await message.reply(
        "✅ No hay problema. Si cambias de opinión, escribe *Menú* para ver las promociones."
      );
    }
    users[chatId].step = "menu";
    return;
  }

  if (
    text === "menú" ||
    text === "menu" ||
    text === "Menu" ||
    text === "Menú"
  ) {
    users[chatId].step = "menu";
    await message.reply(
      "🔹 Volviendo al menú principal...\n\n1️⃣ Ver precios 📊\n2️⃣ Modelos de cámaras 📸\n3️⃣ Contactar con un asesor 👨‍💼\n4️⃣ Promociones 🎉\n\nEscribe el número de la opción que te interesa."
    );
    return;
  }

  await message.reply(
    "🤔 No entendí tu mensaje. Escribe *Menú* para ver nuestras opciones. 😊"
  );
});

client.initialize();
