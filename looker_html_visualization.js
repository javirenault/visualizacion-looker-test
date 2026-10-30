looker.plugins.visualizations.add({
  id: "html_panel_demo",
  label: "HTML Panel Demo",
  options: {
    accent_color: {
      type: "string",
      label: "Accent color",
      default: "#1a73e8"
    },
    show_title: {
      type: "boolean",
      label: "Show title",
      default: true
    }
  },
  create: function (element, config) {
    element.style.height = "100%";
    element.style.width = "100%";
    element.style.padding = "12px";
    element.style.boxSizing = "border-box";
    element.style.fontFamily = "Arial, sans-serif";
    element.innerHTML = '<div class="looker-html-panel"></div>';
  },
  updateAsync: function (data, element, config, queryResponse, details, done) {
    try {
      const container = element.querySelector(".looker-html-panel");
      if (!container) {
        done();
        return;
      }

      const rows = Array.isArray(data) ? data : [];
      const colors = {
        primary: config.accent_color || "#1a73e8",
        bg: "#f5f7fb",
        card: "#ffffff",
        text: "#1f2937",
        muted: "#6b7280",
        border: "rgba(15, 23, 42, 0.08)"
      };

      const dimensions = queryResponse && queryResponse.fields
        ? queryResponse.fields.dimension_like || []
        : [];
      const measures = queryResponse && queryResponse.fields
        ? queryResponse.fields.measure_like || []
        : [];

      const fieldNames = [...dimensions, ...measures].map(field => field.name || "");
      const title = queryResponse && queryResponse.view_label ? queryResponse.view_label : "HTML Panel";

      const rowMarkup = rows.map((row, index) => {
        const cells = fieldNames.length
          ? fieldNames.map(name => {
              const value = row[name];
              const text = value === null || value === undefined ? "-" : value;
              return `<div class="cell"><span class="label">${name}</span><strong>${text}</strong></div>`;
            }).join("")
          : `<div class="cell"><strong>No data</strong></div>`;

        return `
          <div class="card" style="background:${colors.card}; border:1px solid ${colors.border}; border-radius:12px; padding:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div class="row-index" style="color:${colors.muted}; font-size:11px; font-weight:700; margin-bottom:8px;">Registro ${index + 1}</div>
            ${cells}
          </div>
        `;
      }).join("");

      container.innerHTML = `
        <style>
          .looker-html-panel {
            width: 100%;
            height: 100%;
            background: ${colors.bg};
            border-radius: 12px;
            padding: 12px;
            box-sizing: border-box;
            overflow: auto;
            color: ${colors.text};
          }
          .looker-html-panel .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid ${colors.border};
          }
          .looker-html-panel .title {
            font-size: 18px;
            font-weight: 700;
            color: ${colors.text};
          }
          .looker-html-panel .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 999px;
            background: ${colors.primary};
            color: white;
            font-size: 11px;
            font-weight: 700;
          }
          .looker-html-panel .list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
          }
          .looker-html-panel .cell {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 10px;
          }
          .looker-html-panel .label {
            color: ${colors.muted};
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .looker-html-panel strong {
            word-break: break-word;
          }
        </style>
        <div class="header">
          <div class="title">${config.show_title === false ? "" : title}</div>
          <span class="badge">${rows.length} filas</span>
        </div>
        <div class="list">
          ${rowMarkup || '<div class="card" style="background:#fff; border:1px solid rgba(15,23,42,0.08); border-radius:12px; padding:12px;">No hay datos para mostrar.</div>'}
        </div>
      `;

      done();
    } catch (error) {
      console.error("HTML Panel Demo error:", error);
      done(error);
    }
  },
  destroy: function () {
    // Limpieza opcional
  }
});

/*
  Instrucciones de uso en Looker:
  1) Sube este archivo a un servidor HTTPS accesible.
  2) En Looker, ve a Admin > Platform > Visualizations o usa manifest.lkml.
  3) Registra la visualización con el ID: html_panel_demo
  4) En la exploración, selecciona la nueva visualización y guárdala como tile en el panel.
*/
