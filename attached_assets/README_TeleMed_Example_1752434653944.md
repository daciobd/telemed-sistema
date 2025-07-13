
# 📄 TeleMed Example Project - Express + React (Vite Build Simulado)

Este projeto é um exemplo **pronto e funcional** para demonstrar como integrar **Express (Node.js)** com um app **React (Vite)** de forma correta para ambientes de produção.

---

## 📂 Estrutura do Projeto

```
/client/dist/          # Build do React (simulado)
    index.html
    /assets/app.js
/server/index.ts       # Servidor Express
```

---

## 🚀 Como rodar

### 1️⃣ Instale as dependências necessárias para o servidor
(O código é TypeScript, então é necessário ts-node)

```
npm install express
npm install --save-dev ts-node typescript @types/node @types/express
```

### 2️⃣ Execute o servidor Express (development)
```
npx ts-node server/index.ts
```

### 3️⃣ Acesse no navegador:
- `http://localhost:5000/` → Deve mostrar a página do React ("✅ React Router funcionando - Patient Dashboard")
- `http://localhost:5000/patient-dashboard` → Mesmo resultado, SPA funcionando.
- `http://localhost:5000/api/test` → JSON confirmando a API funcionando.

---

## 📝 Por que funciona:
- Express está servindo corretamente a pasta `/client/dist`.
- Qualquer rota desconhecida devolve o `index.html`.
- React Router funciona corretamente em produção.
- API funcional separada (`/api/test`).

---

## 📌 Pontos importantes:
✅ Não misturar o build do Vite com public/ estático.  
✅ Não esquecer do fallback `app.get('*')`.  
✅ Rodar sempre o build (`npm run build`) no Vite para produção real.

