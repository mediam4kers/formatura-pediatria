/* ==================================================================
   Formatura da Pediatria · comportamento do site
   Lê window.FORMATURA (dados.js) e monta a página.
   Não precisa editar este arquivo para trocar textos ou datas.
   ================================================================== */
(function () {
  "use strict";

  var raiz = document.documentElement;
  var D = window.FORMATURA;
  if (!D) {
    raiz.classList.remove("com-abertura");
    raiz.classList.add("mostra-tudo");
    console.error("Não encontrei os dados da formatura. Confira se o arquivo dados.js existe e não tem erro de digitação.");
    return;
  }

  /* ---------------- utilidades ---------------- */

  var SVGNS = "http://www.w3.org/2000/svg";
  var movimento = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }

  function criar(ns, tag, attrs, filhos) {
    var n = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "texto") n.textContent = v;
        else n.setAttribute(k, v);
      });
    }
    (filhos || []).forEach(function (f) { if (f) n.appendChild(f); });
    return n;
  }
  function el(tag, attrs, filhos) { return criar(null, tag, attrs, filhos); }
  function sv(tag, attrs, filhos) { return criar(SVGNS, tag, attrs, filhos); }

  function campo(nome, valor) {
    $$('[data-campo="' + nome + '"]').forEach(function (n) { n.textContent = valor; });
  }
  function esconder(sel) { $$(sel).forEach(function (n) { n.hidden = true; n.style.display = "none"; }); }
  function maiuscula(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function dois(n) { return String(n).padStart(2, "0"); }
  function atraso(i, passo) { return "--atraso:" + (i * (passo || 0.08)).toFixed(2) + "s"; }

  /* ---------------- datas ---------------- */

  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  var EXTENSO = ["zero", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove", "Dez", "Onze", "Doze", "Treze", "Catorze", "Quinze", "Dezesseis", "Dezessete", "Dezoito", "Dezenove", "Vinte"];

  var ev = D.evento || {};
  var fuso = typeof ev.fuso === "number" ? ev.fuso : -3; // horas em relação ao UTC (Brasília = -3)
  var partesData = String(ev.data || "").split("-").map(Number);
  var ano = partesData[0], mes = partesData[1], dia = partesData[2];

  function paraMinutos(hhmm) {
    var p = String(hhmm || "0:0").split(":").map(Number);
    return (p[0] || 0) * 60 + (p[1] || 0);
  }
  function formatarHora(min) {
    var h = Math.floor(min / 60) % 24, m = min % 60;
    return h + "h" + (m ? dois(m) : "");
  }
  function dataUTC(minutosNoDia) {
    return new Date(Date.UTC(ano, mes - 1, dia, 0, minutosNoDia - fuso * 60));
  }

  var minInicio = paraMinutos(ev.inicio);
  var minFim = paraMinutos(ev.fim || "23:59");
  if (minFim <= minInicio) minFim += 1440;
  var inicioUTC = dataUTC(minInicio);
  var fimUTC = dataUTC(minFim);

  var diaSemana = DIAS[new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay()];
  var dataExtenso = dia + " de " + MESES[mes - 1] + " de " + ano;
  var hora = formatarHora(minInicio);

  /* ---------------- textos simples ---------------- */

  var L = D.local || {};
  var C = D.convite || {};
  var formandos = D.formandos || [];
  var homenageados = D.homenageados || [];
  var programacao = D.programacao || [];
  var retrospectiva = D.retrospectiva || [];
  var galeria = D.galeria || [];
  var agradecimentos = D.agradecimentos || [];
  var duvidas = D.duvidas || [];
  var especialidade = D.especialidade || "Pediatria";
  var tituloEvento = "Formatura · " + (D.programa || "Residência em " + especialidade);

  // aviso de dados de exemplo: some sozinho depois de um tempo, ou com um toque
  var aviso = $("[data-aviso]");
  if (D.exemplo && aviso) {
    aviso.hidden = false;
    var sumirAviso = function () { aviso.classList.add("some"); };
    aviso.addEventListener("click", sumirAviso);
    setTimeout(sumirAviso, 12000);
  }

  document.title = "Formatura da " + especialidade + " · Turma " + D.turma;
  campo("marca", especialidade + " · " + D.turma);
  campo("aberturaTurma", especialidade + " · Turma " + D.turma);
  campo("programa", D.programa);
  campo("especialidade", especialidade);
  campo("instituicao", D.instituicao);
  campo("turma", D.turma);
  campo("dia", dia);
  campo("mesAno", MESES[mes - 1] + " · " + ano);
  campo("diaSemana", diaSemana);
  campo("hora", hora);
  campo("quandoLeitor", maiuscula(diaSemana) + ", " + dataExtenso + ", às " + hora + ".");
  campo("dataCompleta", diaSemana + ", " + dataExtenso);
  campo("localNome", L.nome);
  campo("localEndereco", L.endereco);
  campo("localCidade", L.cidade);
  campo("quando", diaSemana + ", " + dataExtenso + ", a partir das " + hora);
  campo("traje", L.traje || "A combinar");
  campo("rodapeQuando", diaSemana + ", " + dataExtenso + " · " + hora + " · " + (L.nome || ""));
  campo("rodapeTurma", "Turma de " + especialidade + " " + D.turma + " · " + D.instituicao);

  // convite
  campo("conviteTitulo", C.titulo || "");
  campo("conviteAssinatura", C.assinatura || "");
  var caixaConvite = $('[data-lista="convite"]');
  (C.texto || []).forEach(function (t) { caixaConvite.appendChild(el("p", { texto: t })); });

  // turma
  var n = formandos.length;
  campo("turmaSub", n ? (EXTENSO[n] || n) + (n === 1 ? " residente" : " residentes") : "");

  // foto de capa (opcional)
  var fotoCapa = D.capa && D.capa.foto;
  if (fotoCapa) {
    var caixaFoto = $("[data-capa-foto]");
    caixaFoto.style.backgroundImage = 'url("' + String(fotoCapa).replace(/"/g, "%22") + '")';
    caixaFoto.classList.add("tem-foto");
  }

  /* ---------------- selo ---------------- */

  $$("[data-selo]").forEach(function (svg, k) {
    var id = "selo-arco-" + k;
    var raio = 78;
    var texto = (D.programa + " · Turma " + D.turma + " · ").toUpperCase();
    svg.appendChild(sv("defs", null, [
      sv("path", { id: id, d: "M100 100 m-" + raio + " 0 a" + raio + " " + raio + " 0 1 1 " + raio * 2 + " 0 a" + raio + " " + raio + " 0 1 1 -" + raio * 2 + " 0" })
    ]));
    svg.appendChild(sv("circle", { class: "selo__anel", cx: 100, cy: 100, r: 97 }));
    svg.appendChild(sv("circle", { class: "selo__anel selo__anel--fino", cx: 100, cy: 100, r: 91 }));
    svg.appendChild(sv("circle", { class: "selo__anel selo__anel--fino", cx: 100, cy: 100, r: 61 }));
    svg.appendChild(sv("g", { class: "selo__giro" }, [
      sv("text", { class: "selo__texto" }, [
        sv("textPath", { href: "#" + id, textLength: Math.floor(2 * Math.PI * raio) - 4, lengthAdjust: "spacing", texto: texto })
      ])
    ]));
    // símbolo do hospital, redesenhado em vetor a partir do logo original (ver assets/logo-hospital.svg)
    svg.appendChild(sv("g", { class: "selo__cheio", transform: "translate(33.85 52.41) scale(1.05)" }, [
      sv("path", { d: "M23.030 26.500A6.500 6.500 0 0 1 36.030 26.500A27.100 27.100 0 1 0 89.970 26.500A6.500 6.500 0 0 1 102.970 26.500A40.400 40.400 0 1 1 23.030 26.500Z" }),
      sv("path", { d: "M43 62h40v18H43z" }),
      sv("path", { "fill-rule": "evenodd", d: "M42.800 31.800a20.200 20.200 0 1 0 40.400 0a20.200 20.200 0 1 0 -40.400 0ZM56.200 28.900a2.200 4 0 1 0 4.400 0a2.200 4 0 1 0 -4.400 0ZM65.400 28.900a2.200 4 0 1 0 4.400 0a2.200 4 0 1 0 -4.400 0ZM52.200 38Q63 44.400 73.800 38Q63 49.800 52.200 38Z" }),
      sv("path", { d: "M27 68h16v12H27zM83 68h16v12H83z", opacity: "0.3" }),
      sv("path", { d: "M27 79h72v1H27z" })
    ]));
  });

  /* ---------------- tela de abertura ---------------- */

  var abertura = $("[data-abertura]");
  var palavraDourada = $("[data-brilha]");
  function entrar() {
    raiz.classList.remove("com-abertura");
    if (palavraDourada) setTimeout(function () { palavraDourada.classList.add("brilhou"); }, 1500);
  }
  function abrirConvite() {
    if (!abertura || abertura.classList.contains("abrindo")) return;
    abertura.classList.add("abrindo");
    // a capa começa a aparecer por trás enquanto as cortinas ainda correm
    setTimeout(entrar, movimento ? 800 : 0);
    setTimeout(function () { abertura.remove(); }, movimento ? 2500 : 800);
  }
  if (raiz.classList.contains("com-abertura")) {
    if (D.abertura === false || !abertura) {
      if (abertura) abertura.remove();
      entrar();
    } else {
      abertura.addEventListener("click", abrirConvite);
      var botaoAbrir = $("[data-abrir]");
      if (botaoAbrir) botaoAbrir.focus({ preventScroll: true });
    }
  } else {
    if (abertura) abertura.remove();
    entrar();
  }

  /* ---------------- contagem regressiva ---------------- */

  var caixaContagem = $("[data-contagem]");
  var fimContagem = $("[data-contagem-fim]");
  var saidas = { dias: $('[data-c="dias"]'), horas: $('[data-c="horas"]'), min: $('[data-c="min"]'), seg: $('[data-c="seg"]') };
  var relogio = null;
  function contar() {
    var falta = inicioUTC.getTime() - Date.now();
    if (falta <= 0) {
      caixaContagem.hidden = true;
      fimContagem.hidden = false;
      fimContagem.textContent = Date.now() < fimUTC.getTime() ? "É hoje. Estamos esperando você." : "Foi uma noite e tanto. Obrigado por ter vindo.";
      if (relogio) clearInterval(relogio);
      return;
    }
    var s = Math.floor(falta / 1000);
    saidas.dias.textContent = Math.floor(s / 86400);
    saidas.horas.textContent = dois(Math.floor((s % 86400) / 3600));
    saidas.min.textContent = dois(Math.floor((s % 3600) / 60));
    saidas.seg.textContent = dois(s % 60);
  }
  contar();
  relogio = setInterval(contar, 1000);

  /* ---------------- brilho dourado do palco ---------------- */

  (function () {
    var canvas = $("[data-brilho]");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, pontos = [], quadro = null, anterior = 0;

    function novo(inicial) {
      var grande = Math.random() < 0.16;
      return {
        x: Math.random() * W,
        y: inicial ? Math.random() * H : H + 30,
        r: grande ? 5 + Math.random() * 13 : 0.5 + Math.pow(Math.random(), 2.2) * 1.8,
        v: grande ? 3 + Math.random() * 5 : 5 + Math.random() * 14,
        fase: Math.random() * 6.28,
        ritmo: 0.4 + Math.random() * 1.1,
        alfa: grande ? 0.05 + Math.random() * 0.07 : 0.2 + Math.random() * 0.55,
        grande: grande
      };
    }
    function medir() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var total = Math.round(Math.max(24, Math.min(56, (W * H) / 22000)));
      pontos = [];
      for (var i = 0; i < total; i++) pontos.push(novo(true));
      desenhar(0, 0);
    }
    function desenhar(t, dt) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pontos.length; i++) {
        var p = pontos[i];
        p.y -= p.v * dt;
        p.x += Math.sin(t * 0.0004 * p.ritmo + p.fase) * 8 * dt;
        if (p.y < -30) pontos[i] = p = novo(false);
        var alfa = p.alfa * (0.55 + 0.45 * Math.sin(t * 0.0011 * p.ritmo + p.fase));
        ctx.globalAlpha = alfa;
        if (p.grande) {
          // bokeh: disco suave com borda um pouco mais clara
          var g = ctx.createRadialGradient(p.x, p.y, p.r * 0.2, p.x, p.y, p.r);
          g.addColorStop(0, "rgba(244,228,182,0.55)");
          g.addColorStop(0.8, "rgba(244,228,182,0.75)");
          g.addColorStop(1, "rgba(244,228,182,0)");
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = "#F4E4B6";
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function passo(t) {
      var dt = Math.min(0.05, (t - anterior) / 1000 || 0);
      anterior = t;
      desenhar(t, dt);
      quadro = requestAnimationFrame(passo);
    }
    function ligar() {
      if (quadro || !movimento || document.hidden) return;
      anterior = performance.now();
      quadro = requestAnimationFrame(passo);
    }
    function desligar() {
      if (quadro) cancelAnimationFrame(quadro);
      quadro = null;
    }

    medir();
    var tempoMedir = null;
    window.addEventListener("resize", function () {
      clearTimeout(tempoMedir);
      tempoMedir = setTimeout(function () { if (canvas.clientWidth !== W || Math.abs(canvas.clientHeight - H) > 120) medir(); }, 200);
    });
    document.addEventListener("visibilitychange", function () { if (document.hidden) desligar(); else ligar(); });
    ligar();
  })();

  /* ---------------- a noite (programação) ---------------- */

  var listaPrograma = $('[data-lista="programacao"]');
  programacao.forEach(function (item) {
    listaPrograma.appendChild(el("li", { class: "momento", "data-revela": "" }, [
      el("div", { class: "momento__cartao vidro-leve" }, [
        el("time", { class: "momento__hora", texto: formatarHora(paraMinutos(item.hora)) }),
        el("h3", { class: "momento__titulo", texto: item.titulo }),
        item.texto ? el("p", { class: "momento__texto", texto: item.texto }) : null
      ])
    ]));
  });

  /* ---------------- a turma ---------------- */

  var listaTurma = $('[data-lista="formandos"]');
  formandos.forEach(function (f, i) {
    var partes = String(f.nome || "").trim().split(/\s+/);
    var iniciais = (partes[0] || "").charAt(0) + (partes.length > 1 ? partes[partes.length - 1].charAt(0) : "");
    listaTurma.appendChild(el("li", { class: "formando", "data-revela": "", style: atraso(i % 4) }, [
      el("div", { class: "formando__foto vidro-leve" }, [
        f.foto
          ? el("img", { src: f.foto, alt: "Foto de " + f.nome, loading: "lazy", width: "600", height: "820" })
          : el("span", { class: "ouro", "aria-hidden": "true", texto: iniciais })
      ]),
      el("h3", { class: "formando__nome", texto: f.nome }),
      f.proximoPasso ? el("p", { class: "formando__passo", texto: f.proximoPasso }) : null,
      f.frase ? el("p", { class: "formando__frase", texto: "“" + f.frase + "”" }) : null
    ]));
  });

  /* ---------------- retrospectiva e galeria ---------------- */

  var listaAnos = $('[data-lista="retrospectiva"]');
  retrospectiva.forEach(function (r, i) {
    listaAnos.appendChild(el("li", { class: "ano vidro-leve", "data-revela": "", style: atraso(i, 0.12) }, [
      el("span", { class: "ano__numero", texto: r.ano }),
      el("h3", { class: "ano__titulo", texto: r.titulo }),
      r.texto ? el("p", { class: "ano__texto", texto: r.texto }) : null
    ]));
  });
  if (retrospectiva.length) {
    var primeiro = retrospectiva[0].titulo, ultimo = retrospectiva[retrospectiva.length - 1].titulo;
    campo("historiaTitulo", retrospectiva.length > 1 ? "De " + primeiro + " a " + ultimo : primeiro);
    campo("historiaSub", (EXTENSO[retrospectiva.length] || retrospectiva.length) + (retrospectiva.length === 1 ? " ano de residência" : " anos de residência"));
  } else {
    campo("historiaTitulo", "A turma em fotos");
    campo("historiaSub", "");
  }

  var listaGaleria = $('[data-lista="galeria"]');
  galeria.forEach(function (g) {
    var item = typeof g === "string" ? { foto: g } : g;
    listaGaleria.appendChild(el("li", { class: "galeria__item vidro-leve" }, [
      item.foto
        ? el("img", { src: item.foto, alt: item.legenda || "Foto da turma", loading: "lazy" })
        : sv("svg", { class: "galeria__vazio", viewBox: "0 0 34 34", "aria-hidden": "true" }, [
            sv("path", { d: "M17 2l15 15-15 15L2 17z" }),
            sv("path", { d: "M17 10l7 7-7 7-7-7z" })
          ]),
      item.legenda ? el("p", { class: "galeria__legenda", texto: item.legenda }) : null
    ]));
  });

  /* ---------------- homenagens e agradecimentos ---------------- */

  var listaHomenagens = $('[data-lista="homenageados"]');
  homenageados.forEach(function (h) {
    listaHomenagens.appendChild(el("li", { class: "homenagem" }, [
      h.papel ? el("p", { class: "homenagem__papel", texto: h.papel }) : null,
      el("h3", { class: "homenagem__nome", texto: h.nome }),
      h.descricao ? el("p", { class: "homenagem__desc", texto: h.descricao }) : null,
      h.nota ? el("p", { class: "homenagem__nota", texto: h.nota }) : null
    ]));
  });

  var listaAgradecimentos = $('[data-lista="agradecimentos"]');
  agradecimentos.forEach(function (a, i) {
    listaAgradecimentos.appendChild(el("li", { class: "agradecimento", "data-revela": "", style: atraso(i % 2, 0.12) }, [
      el("h3", { class: "agradecimento__a", texto: a.a }),
      el("p", { class: "agradecimento__texto", texto: a.texto })
    ]));
  });

  var E = D.epigrafe;
  if (E && E.texto) {
    campo("epigrafeTexto", E.texto);
    campo("epigrafeFonte", E.fonte || "");
  }

  /* ---------------- local ---------------- */

  var busca = encodeURIComponent(L.busca || [L.nome, L.endereco, L.cidade].filter(Boolean).join(", "));
  var iframe = $("[data-mapa]");
  if (iframe) iframe.src = "https://maps.google.com/maps?q=" + busca + "&z=16&hl=pt-BR&output=embed";
  var linkMaps = $('[data-link="maps"]');
  var linkWaze = $('[data-link="waze"]');
  if (linkMaps) linkMaps.href = "https://www.google.com/maps/search/?api=1&query=" + busca;
  if (linkWaze) linkWaze.href = "https://waze.com/ul?q=" + busca + "&navigate=yes";

  /* ---------------- bom saber ---------------- */

  var listaDuvidas = $('[data-lista="duvidas"]');
  duvidas.forEach(function (d, i) {
    listaDuvidas.appendChild(el("details", { class: "duvida vidro-leve", "data-revela": "", style: atraso(i, 0.06) }, [
      el("summary", { texto: d.pergunta }),
      el("p", { class: "duvida__resposta", texto: d.resposta })
    ]));
  });

  /* ---------------- agenda ---------------- */

  function utcCompacto(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  var localCompleto = [L.nome, L.endereco, L.cidade].filter(Boolean).join(", ");
  var descricao = "Formatura da " + D.programa + " · Turma " + D.turma + " · " + D.instituicao + ". Traje: " + (L.traje || "a combinar") + ".";

  var linkGoogle = $('[data-agenda="google"]');
  if (linkGoogle) {
    linkGoogle.href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(tituloEvento) +
      "&dates=" + utcCompacto(inicioUTC) + "/" + utcCompacto(fimUTC) +
      "&details=" + encodeURIComponent(descricao + " " + location.href.split("#")[0]) +
      "&location=" + encodeURIComponent(localCompleto);
  }
  var linkIcs = $('[data-agenda="ics"]');
  if (linkIcs) {
    var esc = function (t) { return String(t).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;"); };
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Formatura Pediatria//PT-BR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:formatura-" + utcCompacto(inicioUTC) + "@pediatria",
      "DTSTAMP:" + utcCompacto(new Date()),
      "DTSTART:" + utcCompacto(inicioUTC),
      "DTEND:" + utcCompacto(fimUTC),
      "SUMMARY:" + esc(tituloEvento),
      "LOCATION:" + esc(localCompleto),
      "DESCRIPTION:" + esc(descricao),
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:" + esc(tituloEvento), "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    linkIcs.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  }
  var menuAgenda = $(".agenda");
  document.addEventListener("click", function (e) {
    if (menuAgenda && menuAgenda.open && !menuAgenda.contains(e.target)) menuAgenda.open = false;
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuAgenda && menuAgenda.open) {
      menuAgenda.open = false;
      $("summary", menuAgenda).focus();
    }
  });
  $$(".agenda__menu a").forEach(function (a) {
    a.addEventListener("click", function () { setTimeout(function () { menuAgenda.open = false; }, 50); });
  });

  /* ---------------- seções sem conteúdo ---------------- */

  function semSecao(id) {
    esconder("#" + id);
    $$('.barra__links a[href="#' + id + '"]').forEach(function (a) { a.parentNode.style.display = "none"; });
  }
  if (!programacao.length) semSecao("programacao");
  if (!formandos.length) semSecao("turma");
  if (!retrospectiva.length && !galeria.length) semSecao("historia");
  if (!retrospectiva.length) esconder('[data-lista="retrospectiva"]');
  if (!homenageados.length) semSecao("homenagens");
  if (!agradecimentos.length) semSecao("agradecimentos");
  if (!E || !E.texto) semSecao("epigrafe");
  if (!duvidas.length) semSecao("duvidas");
  if (!C.texto || !C.texto.length) semSecao("convite");

  /* ---------------- revelação ao rolar ---------------- */

  var revelaveis = $$("[data-revela]");
  if (movimento && "IntersectionObserver" in window) {
    var obsRevela = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visto"); obsRevela.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revelaveis.forEach(function (r) { obsRevela.observe(r); });
  } else {
    revelaveis.forEach(function (r) { r.classList.add("visto"); });
  }

  /* ---------------- luz que acompanha o mouse nos painéis de vidro ---------------- */

  if (window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", function (e) {
      var alvo = e.target.closest && e.target.closest("[data-luz]");
      if (!alvo) return;
      var r = alvo.getBoundingClientRect();
      alvo.style.setProperty("--mx", (e.clientX - r.left) + "px");
      alvo.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }
})();
