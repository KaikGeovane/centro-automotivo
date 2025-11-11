const form = document.getElementById('controleFormCompleto');
const resultado = document.getElementById('resultado');
const registrosSalvos = document.getElementById('registrosSalvos');
const verBtn = document.getElementById('verRegistros');
const limparBtn = document.getElementById('limparRegistros');
const enviarBtn = document.getElementById('enviarWhatsApp');

// ------------------- FORMULÁRIO -------------------
form.addEventListener('submit', function(e) {
  e.preventDefault();

  let cliente = document.getElementById('cliente').value.trim();
  cliente = cliente.charAt(0).toUpperCase() + cliente.slice(1).toLowerCase();
  const carro = document.getElementById('carro').value;
  const pecasSelecionadas = Array.from(document.querySelectorAll('input[name="pecas"]:checked'))
    .map(el => el.value);

  if (!cliente || !carro || pecasSelecionadas.length === 0) {
    alert("Preencha o nome, selecione o carro e marque ao menos uma peça.");
    return;
  }

  const registro = {
    cliente,
    carro,
    pecas: pecasSelecionadas,
    data: new Date().toLocaleString()
  };

  const registros = JSON.parse(localStorage.getItem('registros')) || [];
  registros.push(registro);
  localStorage.setItem('registros', JSON.stringify(registros));

  resultado.style.display = "block";
  resultado.innerHTML = `
    <h3>Registro salvo com sucesso!</h3>
    <p><strong>Cliente:</strong> ${cliente}</p>
    <p><strong>Carro:</strong> ${carro}</p>
    <p><strong>Peças:</strong> ${pecasSelecionadas.join(", ")}</p>
    <p><em>Data: ${registro.data}</em></p>
  `;

  registrosSalvos.style.display = "none";

  setTimeout(() => {
    resultado.style.opacity = "0";
    setTimeout(() => {
      resultado.style.display = "none";
      resultado.innerHTML = "";
      resultado.style.opacity = "1";
    }, 500);
  }, 5000);

  form.reset();
});

// ------------------- VER REGISTROS -------------------
verBtn.addEventListener('click', () => {
  const registros = JSON.parse(localStorage.getItem('registros')) || [];

  if (registrosSalvos.style.display === "block") {
    registrosSalvos.style.display = "none";
    return;
  }

  if (registros.length === 0) {
    registrosSalvos.innerHTML = "<p>Nenhum registro salvo ainda.</p>";
  } else {
    registrosSalvos.innerHTML = "<h3>Registros Salvos</h3>";
    registros.forEach((r, index) => {
      registrosSalvos.innerHTML += `
        <div class="registro-item">
          <p><strong>Cliente:</strong> ${r.cliente}</p>
          <p><strong>Carro:</strong> ${r.carro}</p>
          <p><strong>Peças:</strong> ${r.pecas.join(", ")}</p>
          <p><em>${r.data}</em></p>
          <p><strong>Valor total:</strong> __________</p>
          <p><strong>Assinatura:</strong> ____________________________</p>
          <button class="btn-enviar-whats-item" data-index="${index}">Enviar WhatsApp</button>
          <button class="btn-imprimir-item" data-index="${index}">Imprimir</button>
          <hr>
        </div>
      `;
    });
  }

  registrosSalvos.style.display = "block";

  // WhatsApp individual
  document.querySelectorAll('.btn-enviar-whats-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      const r = JSON.parse(localStorage.getItem('registros'))[index];
      const mensagem = `*JC Centro Automotivo*\n\nCliente: ${r.cliente}\nCarro: ${r.carro}\nPeças: ${r.pecas.join(", ")}\nData: ${r.data}`;
      const url = `https://wa.me/5531992279677?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
    });
  });

  // Impressão individual
  document.querySelectorAll('.btn-imprimir-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      const r = JSON.parse(localStorage.getItem('registros'))[index];
      imprimirRegistro(r.cliente, r.carro, r.pecas, r.data);
    });
  });
});

// ------------------- ENVIAR ÚLTIMO REGISTRO -------------------
enviarBtn.addEventListener('click', () => {
  const registros = JSON.parse(localStorage.getItem('registros')) || [];
  if (registros.length === 0) {
    alert("Nenhum registro salvo para enviar.");
    return;
  }
  const ultimo = registros[registros.length - 1];
  const mensagem = `*JC Centro Automotivo*\n\nCliente: ${ultimo.cliente}\nCarro: ${ultimo.carro}\nPeças: ${ultimo.pecas.join(", ")}\nData: ${ultimo.data}`;
  const url = `https://wa.me/5531992279677?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
});

// ------------------- LIMPAR REGISTROS -------------------
limparBtn.addEventListener('click', () => {
  if (confirm("Deseja realmente apagar todos os registros salvos?")) {
    localStorage.removeItem('registros');
    registrosSalvos.innerHTML = "<p>Todos os registros foram apagados.</p>";
  }
});

// ------------------- FUNÇÃO DE IMPRESSÃO -------------------
function imprimirRegistro(cliente, carro, pecas, data) {
  
  
  
    const categorias = {
    Motor: ['Bloco do motor','Cabeçote','Pistão','Anel de pistão','Biela','Virabrequim','Cárter','Junta do cabeçote','Comando de válvulas','Válvulas','Assentos de válvula','Mola de válvula','Tuchos','Correia dentada','Tensor de correia','Corrente de comando','Polia','Balancins','Carenagem do motor'],
    'Sistema de Combustível': ['Bomba de combustível','Filtro de combustível','Bico injetor / Injetores','Regulador de pressão','Linha de combustível','Tanque de combustível','Válvula de retorno'],
    Ignição: ['Velas de ignição','Cabos de vela','Bobina de ignição','Módulo de ignição','Distribuidor'],
    'Sistema de Arrefecimento': ['Radiador','Ventoinha / Ventilador','Bomba d\'água','Termostato','Mangueiras do radiador','Reservatório de expansão','Sensor de temperatura'],
    'Sistema de Lubrificação': ['Filtro de óleo','Bomba de óleo','Carter / Cárter','Óleo do motor (troca)'],
    Escape: ['Coletor de escape','Catalisador','Silencioso / Escape','Sonda lambda / Sensor de O2'],
    'Transmissão / Embreagem': ['Disco de embreagem / Embreagem','Kit de embreagem','Platô','Rolamento de embreagem','Caixa de câmbio','Óleo de câmbio','Componentes câmbio automático'],
    'Eixos e Transmissão Final': ['Semi-eixo','Eixo cardan','Junta homocinética','Cruzetas'],
    Suspensão: ['Amortecedor','Mola helicoidal','Bucha da suspensão','Braço oscilante','Pivô','Bieleta / Barra estabilizadora'],
    Direção: ['Caixa de direção','Bomba de direção hidráulica','Haste / Terminal de direção','Barra de direção','Cremalheira'],
    Freios: ['Pastilha de freio','Disco de freio','Tambor de freio','Cilindro mestre','Pinça de freio','Sensor ABS','Flexível de freio','Fluido de freio'],
    'Rodas e Pneus': ['Pneu','Câmara (se aplicável)','Roda / Aro','Parafuso / Porca de roda','Calota / Tampa','Sensor TPMS / Sensor de pressão'],
    'Sistema Elétrico': ['Bateria','Alternador','Motor de arranque','Fusível','Relé','Chicote / Fiação','Módulo / ECU','Painel de instrumentos','Interruptores / Botões'],
    Iluminação: ['Farol dianteiro','Farol de neblina','Lanterna traseira','Pisca / Seta','Lâmpadas','DRL / Luz diurna'],
    'Carroceria e Estrutura': ['Parachoque dianteiro','Parachoque traseiro','Capô','Tampa traseira / porta-malas','Porta dianteira','Porta traseira','Retrovisor (lateral)','Retrovisor interno','Soleira'],
    'Vidros e Selantes': ['Para-brisa','Vidro dianteiro lateral','Vidro traseiro lateral','Máquina de vidro / motor do vidro','Borracha de vedação / guarnição'],
    'Interior e Conforto': ['Banco dianteiro','Banco traseiro','Estofamento / capa','Cinto de segurança','Airbag','Painel central','Volante','Alavanca de câmbio'],
    'Ar Condicionado / Ventilação': ['Compressor do ar condicionado','Filtro de cabine / polen','Condensador','Evaporador','Válvula de expansão'],
    Segurança: ['Cinto de segurança dianteiro','Cinto de segurança traseiro','Airbag lateral','Sistema ABS','Controle de tração / estabilidade'],
    'Sensores e Atuadores': ['Sensor de temperatura','Sensor de pressão de óleo','Sensor MAP','Sensor de rotação (RPM)','Atuador de marcha lenta'],
    'Juntas, Selos e Peças pequenas': ['Junta do cabeçote','Retentor do virabrequim','Selo / junta bomba d\'água','Anéis','Abraçadeira','Parafuso / Porca / Arruela'],
    Filtros: ['Filtro de ar','Filtro de óleo','Filtro de combustível','Filtro de cabine'],
    Acessórios: ['Kit de iluminação','Tapetes','Rádio / Central multimídia','Alarme / Sensor de estacionamento','Sensor de estacionamento'],
    Manutenção: ['Correia acessória','Troca correia dentada','Alinhamento','Balanceamento','Troca de óleo']
  };

  function gerarPecasUsadas(categoria) {
    const usadas = categorias[categoria].filter(p => pecas.includes(p));
    if (usadas.length === 0) return '';
    return `
      <div class="categoria">
        <h4>${categoria}</h4>
        <ul>
          ${usadas.map(p => `<li>☑ ${p}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  const conteudo = `
    <html>
    <head>
      <title>Orçamento - JC Centro Automotivo</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; color: #000000ff; border: 2px solid #000000ff; padding: 30px; max-width: 800px; }
        header { text-align: center; margin-bottom: 25px; }
        .logo { width: 60px; height: 60px; margin: 0 auto; }
        h1 { margin: 10px 0 5px 0; font-size: 24px; color: #1a73e8; }
        .info p { margin: 5px 0; font-size: 16px; }
        .pecas h3 { color: #000000ff; margin-bottom: 10px; }
        .categoria { margin-bottom: 15px; }
        .categoria h4 { margin-bottom: 5px; color: #0b3d91; font-size: 15px; }
        ul { margin: 0; padding-left: 20px; }
        ul li { margin-bottom: 4px; font-size: 14px; }
        .valor-total, .assinatura { margin-top: 30px; }
        .valor-total p, .assinatura p { font-size: 16px; margin: 5px 0; }
        hr { border: 0; border-top: 1px dashed #aaa; margin: 20px 0; }
      </style>
    </head>
    <body>
     <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto;">
      <header style="text-align: center; margin-bottom: 0px;">
         
        <h1>JC Centro Automotivo</h1>
      </header>

      <div class="info">
        <p><strong>Cliente:</strong> ${cliente}</p>
        <p><strong>Carro:</strong> ${carro}</p>
        <p><strong>Data:</strong> ${data}</p>
      </div>

      <div class="pecas">
        <h3>Peças Utilizadas</h3>
        ${Object.keys(categorias).map(c => gerarPecasUsadas(c)).join('')}
      </div>

      <div class="valor-total">
        <p><strong>Valor total:</strong> __________</p>
      </div>

      <div class="assinatura">
        <p>__________________________________________</p>
        <p>Assinatura do responsável</p>
      </div>
    </body>
    </html>
  `;

  const janela = window.open('', '', 'width=900,height=700');
  janela.document.write(conteudo);
  janela.document.close();
  janela.print();
}


// ------------------- BOTÃO PARA IMPRIMIR ÚLTIMO REGISTRO -------------------
const imprimirBtn = document.getElementById('imprimirRegistro');
if (imprimirBtn) {
  imprimirBtn.addEventListener('click', () => {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    if (registros.length === 0) {
      alert("Nenhum registro para imprimir.");
      return;
    }
    const ultimo = registros[registros.length - 1];
    imprimirRegistro(ultimo.cliente, ultimo.carro, ultimo.pecas, ultimo.data);
  });
}
