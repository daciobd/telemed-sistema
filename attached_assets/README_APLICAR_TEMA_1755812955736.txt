
Como aplicar o tema TeleMed em QUALQUER página (cadastro.html, perfildomedico.html, mobile.html, etc):

1) Adicione no <head>:
   <link rel="stylesheet" href="./telemed-theme.css">

2) Adicione a classe "tm" no <body>:
   <body class="tm">

3) Remova gradientes/cores inline conflitantes (opcional). O tema já sobrescreve a maioria.
4) Botões: mantenha suas classes atuais; o tema já estiliza .save-btn, .btn-primary, .back-btn, .device-btn, .page-btn, etc.
5) Inputs: o tema estiliza todos os <input>, <select> e <textarea> automaticamente.

Dica: se quiser desligar o tema em alguma página, remova a classe "tm" do <body>.
