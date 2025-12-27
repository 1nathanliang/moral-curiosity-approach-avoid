import $ from 'jquery';
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

const info = <const>{
  name: "survey-html-form",
  version: "1.0.0",
  parameters: {
    custom_html: { type: ParameterType.BOOL, default: false },
    html: { type: ParameterType.HTML_STRING, default: null },
    preamble: { type: ParameterType.HTML_STRING, default: null },
    button_label: { type: ParameterType.STRING, default: "Next Page" },
    request_response: { type: ParameterType.BOOL, default: true },
    randomize_question_order: { type: ParameterType.BOOL, default: false },
    autofocus: { type: ParameterType.STRING, default: "" },
    dataAsArray: { type: ParameterType.BOOL, default: false },
    autocomplete: { type: ParameterType.BOOL, default: false },    
  },
  data: {
    response: { type: ParameterType.OBJECT },
    rt: { type: ParameterType.INT },
  },
};

type Info = typeof info;

class SurveyHtmlFormPlugin implements JsPsychPlugin<Info> {
  static info = info;
  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    let html = "";
    
    // 1. Build Preamble
    if (trial.preamble !== null) {
      html += `<div class="jspsych-survey-html-form-preamble">${trial.preamble}</div>`;
    }

    // 2. Start Form
    html += `<form class="jspsych-survey-html-form" autocomplete="${trial.autocomplete ? 'on' : 'off'}">`;

    if (trial.custom_html) {
      html += trial.html;
    }

    // 3. Generate Questions
    let question_order = Array.from(trial.questions.keys());
    if (trial.randomize_question_order) {
      question_order = this.jsPsych.randomization.shuffle(question_order);
    }

    for (let i = 0; i < question_order.length; i++) {
      const question = trial.questions[question_order[i] as number];
      const question_id = `jspsych-survey-question-${i}`;
      const format = question.format;
      
      html += `<fieldset class="jspsych-survey-html-form-question-${question.background ? 'minimal' : 'rich'} incomplete" id="${question_id}">`;

      if (format === "slider") {
        const direction = question.direction || 'bipolar';
        html += `
          <label class="jspsych-survey-html-form-prompt" for="slider-${question_id}">${question.prompt}</label>
          <input 
            id="slider-${question_id}"
            class="jspsych-slider"
            name="${question.name}" 
            type="range"
            value="${question.starting_value}"
            data-starting-value="${question.starting_value}"
            data-touched="false"
            min="${question.range[0]}" max="${question.range[1]}" step="${question.range[2] || 1}" 
            onmousedown="this.setAttribute('data-touched', 'true'); this.classList.add('${direction}-clicked');"
          >
          <div class="jspsych-slider-anchor-container">
            <span class="jspsych-slider-left-anchor">${question.anchors.left}</span>
            <span class="jspsych-slider-center-anchor">${question.anchors.center || ''}</span>
            <span class="jspsych-slider-right-anchor">${question.anchors.right}</span>
          </div>`;
      } else if (format === "radio" || format === "checkbox") {
        // MULTIPLE CHOICE INPUT
        html += `<p class="jspsych-survey-html-form-prompt">${question.prompt}</p>`;
        const orientation = question.orientation || 'vertical';
        html += `<div class="jspsych-survey-html-form-options-container-${orientation}" role="${format}group">`;
        
        for (let j = 0; j < question.options.length; j++) {
          const option_id = `${question_id}-opt-${j}`;
          html += `
            <label class="jspsych-survey-html-form-${format}-option-${orientation}" for="${option_id}">
              <span class="${format}-button"></span>
              <input type="${format}" name="${question.name}" id="${option_id}" value="${question.options[j]}">
              <span class="${format}-button-label-${orientation}">${question.options[j]}</span>`;
          
          if (question.write_in && question.write_in.includes(question.options[j])) {
            html += `<input type="text" name="${question.name}-writein" class="jspsych-survey-html-form-writein">`;
          }
          html += `</label>`;
        }
        html += `</div>`;
      }
      else if (format == "number") {
        // NUMBER INPUT
        var number_prompt = question.prompt;
        var number_name = question.name;
        var number_id = question_id;
        var number_min = question.min;
        var number_max = question.max;
        var number_step = question.step || 1;
        html += `
          <label class="jspsych-survey-html-form-prompt" for="jspsych-survey-html-form-response-${number_id}">${number_prompt}</label>
          <input 
            id="jspsych-survey-html-form-response-${number_id}"
            class="jspsych-number-input" 
            name="${number_name}" 
            type="number" 
            min="${number_min}" max="${number_max}" step="${number_step}" 
          >
        `;
      }
      html += "</fieldset>";
    }

    // 4. Modal HTML
    html += `
      <div id="jspsych-survey-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;"></div>
      <div id="jspsych-confirm-popup" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:20px; border-radius:8px; z-index:1000; box-shadow:0 4px 15px rgba(0,0,0,0.2); text-align:center;">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="border-radius: 50%; background-color: #fcf3de; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; margin-top: 10px; border: 12px solid #fdfbf1;">
            <i class="fa-solid fa-triangle-exclamation" style="color: #edb423"></i>
          </div>
          <h2>Are you sure?</h2>
        </div>
          <p style="text-align: center;">There is at least one unanswered question.<br>Would you like to continue?</p>
          <button type="button" id="confirm-yes" class="jspsych-survey-html-form-next jspsych-btn" style="margin-right:10px;">Answer Question(s)</button>
          <button type="button" id="confirm-no" class="jspsych-btn">Continue Without Answering</button>
      </div>`;

    // 5. Submit Button
    html += `
      <div style="display: flex; justify-content: right; margin-top: 20px;">
        <button type="submit" class="jspsych-btn jspsych-survey-html-form-next">
          ${trial.button_label}<i class="fa-solid fa-circle-arrow-right fa-sm" style="margin-left: 5px;"></i>
        </button>
      </div></form>`;

    // 6. SINGLE INJECTION POINT
    display_element.innerHTML = html;

    // --- START POST-INJECTION LOGIC ---
    // Auto-select the radio/checkbox when the user types in a write-in field
    display_element.querySelectorAll<HTMLInputElement>('.jspsych-survey-html-form-writein').forEach(writein => {
      writein.addEventListener('input', () => {
        const parentLabel = writein.closest('label');
        const associatedInput = parentLabel?.querySelector('input') as HTMLInputElement;

        if (associatedInput && writein.value.trim() !== "") {
          // 1. Programmatically check the "Other" radio button
          associatedInput.checked = true;

          // 2. IF it's a radio button, remove 'selected' from all other options in this group
          if (associatedInput.type === 'radio') {
            const groupName = associatedInput.name;
            display_element.querySelectorAll(`input[name="${groupName}"]`).forEach(i => {
              i.closest('label')?.classList.remove('selected');
            });
          }

          // 3. Add 'selected' to the current "Other" label
          parentLabel?.classList.add('selected');

          // 4. Trigger validation so the 'incomplete' warning disappears
          associatedInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });

    // Dynamic Horizontal Width
    const container = display_element.querySelector('.jspsych-survey-html-form-options-container-horizontal') as HTMLElement;
    if (container) {
      container.style.setProperty('--option-count', container.children.length.toString());
    }

    // Initialize Sliders
    display_element.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(s => {
      s.value = s.getAttribute('data-starting-value') || "50";
    });

    // 1. Handle Visual Checkmarks for Multiple Choice
    const svg_icon = '<span class="checkmark-svg"><svg height="1rem" viewBox="0 0 24 24" width="1rem" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M17.8062 7.37181C18.0841 7.67897 18.0603 8.15325 17.7532 8.43115L9.8782 15.5562C9.59605 15.8114 9.16747 15.815 8.88113 15.5644L5.88113 12.9394C5.5694 12.6667 5.53782 12.1928 5.81058 11.8811C6.08334 11.5694 6.55716 11.5378 6.86889 11.8106L9.36667 13.9961L16.7468 7.31885C17.054 7.04094 17.5283 7.06466 17.8062 7.37181Z"></path></svg></span>';
    display_element.querySelectorAll('.radio-button, .checkbox-button').forEach(btn => {
      btn.insertAdjacentHTML('beforeend', svg_icon);
    });

    // 2. Universal "Incomplete" Remover & Selection Highlighter
    display_element.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (!target) return;

      const fieldset = target.closest('fieldset');
      if (!fieldset) return;

      // 1. Logic for Number/Text inputs (EXCLUDING optional write-ins)
      if ((target.type === 'number' || target.type === 'text') && 
          !target.classList.contains('jspsych-survey-html-form-writein')) {
        
        if (target.value.trim() !== "") {
          fieldset.classList.remove('incomplete');
        } else {
          fieldset.classList.add('incomplete');
        }
      }

      // 2. Logic for Multiple Choice (Including those with write-ins)
      if (target.type === 'radio' || target.type === 'checkbox') {
        // Selecting the bubble ALWAYS marks the question as complete, 
        // regardless of whether the write-in box is empty.
        fieldset.classList.remove('incomplete'); 
        
        const label = target.closest('label');
        if (target.type === 'radio') {
          display_element.querySelectorAll(`input[name="${target.name}"]`).forEach(i => {
            i.closest('label')?.classList.remove('selected');
          });
        }
        target.checked ? label?.classList.add('selected') : label?.classList.remove('selected');
      }
    });

    // 3. Special Case for Sliders (mousedown counts as interaction even if value doesn't change)
    display_element.querySelectorAll('input[type="range"]').forEach(slider => {
      slider.addEventListener('mousedown', () => {
        slider.closest('fieldset')?.classList.remove('incomplete');
        slider.setAttribute('data-touched', 'true');
      });
    });

    // Form Submission
    const form = display_element.querySelector(".jspsych-survey-html-form") as HTMLFormElement;
    let forceSubmit = false;
    const startTime = performance.now();

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const incomplete = display_element.querySelectorAll(".incomplete");
      if (trial.request_response && incomplete.length > 0 && !forceSubmit) {
        (display_element.querySelector("#jspsych-survey-overlay") as HTMLElement).style.display = "block";
        (display_element.querySelector("#jspsych-confirm-popup") as HTMLElement).style.display = "block";

        display_element.querySelector("#confirm-yes")?.addEventListener("click", () => {
          (display_element.querySelector("#jspsych-survey-overlay") as HTMLElement).style.display = "none";
          (display_element.querySelector("#jspsych-confirm-popup") as HTMLElement).style.display = "none";
        }, { once: true });

        display_element.querySelector("#confirm-no")?.addEventListener("click", () => {
          forceSubmit = true;
          form.dispatchEvent(new Event('submit'));
        }, { once: true });
        return;
      }

      // Final processing
      display_element.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(s => {
        if (s.getAttribute('data-touched') !== 'true') s.removeAttribute('name');
      });

      const raw_data = serializeArray(form);
      const final_data = trial.dataAsArray ? raw_data : objectifyForm(raw_data);

      if (!trial.dataAsArray) {
        trial.questions.forEach((q: any) => { if (!(q.name in final_data)) final_data[q.name] = null; });
      }

      display_element.innerHTML = "";
      this.jsPsych.finishTrial({ rt: Math.round(performance.now() - startTime), response: final_data });
    });

    function serializeArray(f: HTMLFormElement) {
      const data: any[] = [];
      for (let i = 0; i < f.elements.length; i++) {
        const field = f.elements[i] as any;
        
        // Safety: Skip fields without names (we just removed names from untouched sliders)
        if (!field.name || field.disabled || ['submit', 'button'].includes(field.type)) continue;

        if ((field.type !== "checkbox" && field.type !== "radio") || field.checked) {
          // Only push to the array if the value is NOT an empty string
          if (field.value !== "" && field.value !== null) {
            data.push({ name: field.name, value: field.value });
          }
        }
      }
      return data;
    }

    function objectifyForm(arr: any[]) {
      const obj: any = {};
      arr.forEach(i => {
        if (i.name in obj) {
          obj[i.name] = Array.isArray(obj[i.name]) ? [...obj[i.name], i.value] : [obj[i.name], i.value];
        } else { obj[i.name] = i.value; }
      });
      return obj;
    }
  }
}

export default SurveyHtmlFormPlugin;