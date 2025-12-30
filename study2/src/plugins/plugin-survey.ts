import $ from 'jquery';
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

const info = <const>{
  name: "survey",
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

class SurveyPlugin implements JsPsychPlugin<Info> {
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
      html += trial.custom_html;
    } else {

      // 3. Generate Questions
      let question_order = Array.from(trial.questions.keys());
      if (trial.randomize_question_order) {
        question_order = this.jsPsych.randomization.shuffle(question_order);
      }

      for (let question_idx = 0; question_idx < question_order.length; question_idx++) {
        const question = trial.questions[question_order[question_idx] as number];
        const question_id = `jspsych-survey-question-${question_idx}`;
        const question_name = question.name || question_id;
        const question_format = question.format || 'text';
        const question_requirements = question.requirements === 'required' ? 'required' : '';
        const question_prompt = question.prompt || "";
        
        html += `<fieldset class="jspsych-survey-html-form-question-${question.background ? 'minimal' : 'minimal'} incomplete" id="${question_id}">`;

        if (question_format === "slider") {
          const direction = question.direction || 'bipolar';
          const color_scheme = question.color_scheme || (direction === 'unipolar' ? 'purple' : 'orange-purple');

          html += `
            <label class="jspsych-survey-html-form-prompt" for="slider-${question_id}">${question_prompt}</label>
            <input 
              id="slider-${question_id}"
              class="jspsych-slider"
              name="${question_name}" 
              type="range"
              value="${question.starting_value}"
              data-starting-value="${question.starting_value}"
              data-touched="false"
              ${question_requirements}
              min="${question.range[0]}" max="${question.range[1]}" step="${question.range[2] || 1}" 
              onmousedown="this.setAttribute('data-touched', 'true'); this.classList.add('${direction}-clicked-${color_scheme}');"
            >
            <div class="jspsych-slider-anchor-container">
              <span class="jspsych-slider-left-anchor">${question.anchors.left}</span>
              <span class="jspsych-slider-center-anchor">${question.anchors.center || ''}</span>
              <span class="jspsych-slider-right-anchor">${question.anchors.right}</span>
            </div>`;
        } else if (question_format === "radio" || question_format === "checkbox") {
          // MULTIPLE CHOICE INPUT
          const question_orientation = question.orientation || 'vertical';
          html += `<p class="jspsych-survey-html-form-prompt">${question_prompt}</p>`;
          html += `<div class="jspsych-survey-html-form-options-container-${question_orientation}" role="${question_format}group">`;
          
          for (let option_idx = 0; option_idx < question.options.length; option_idx++) {
            const option_id = `${question_id}-opt-${option_idx}`;
            html += `
              <label class="jspsych-survey-html-form-${question_format}-option-${question_orientation}" for="${option_id}">
                <span class="${question_format}-button"></span>
                <input type="${question_format}" name="${question_name}" id="${option_id}" value="${question.options[option_idx]}" ${question_requirements}>
                <span class="${question_format}-button-label-${question_orientation}">${question.options[option_idx]}</span>`;
            
            if (question.write_in && question.write_in.includes(question.options[option_idx])) {
              html += `<input type="text" name="${question_name}-writein" class="jspsych-survey-html-form-writein">`;
            }
            html += `</label>`;
          }
          html += `</div>`;
        }
        else if (question_format == "number") {
          // NUMBER INPUT
          // Attributes specific to numerical entry inputs:
          const question_range_min = question.min || 0;
          const question_range_max = question.max || 100;
          const question_range_step = question.step || 1;

          html += `
            <label class="jspsych-survey-html-form-prompt" for="jspsych-survey-html-form-response-${question_id}">${question_prompt}</label>
            <input 
              id="jspsych-survey-html-form-response-${question_id}"
              class="jspsych-number-input" 
              name="${question_name}"
              type="number"
              min="${question_range_min}"
              max="${question_range_max}"
              step="${question_range_step}"
              ${question_requirements}>
          `;
        } else if (question_format == "short_response") {
          const question_max_length = question.max_length ? `maxlength="${question.max_length}"` : "";
          const question_placeholder = question.placeholder ? `placeholder="${question.placeholder}"` : "";
          // SHORT TEXT INPUT
          html += `
            <label class="jspsych-survey-html-form-prompt" for="jspsych-survey-html-form-response-${question_id}">${question_prompt}</label>
            <input 
              id="jspsych-survey-html-form-response-${question_id}"
              class="jspsych-text-input" 
              name="${question_name}"
              type="text"
              ${question_max_length}
              ${question_placeholder}
              ${question_requirements}>
          `;
        } else if (question_format == "essay") {
          const question_essay_rows = question.rows ? question.rows : 5;
          const question_essay_cols = question.cols ? question.cols : 40;
          const question_essay_max_length = question.max_length ? `maxlength="${question.max_length}"` : "";
          const question_essay_placeholder = question.placeholder ? `placeholder="${question.placeholder}"` : "";
          // LONG TEXT INPUT
          html += `
            <label class="jspsych-survey-html-form-prompt" for="jspsych-survey-html-form-response-${question_id}">${question_prompt}</label>
            <textarea
              id="jspsych-survey-html-form-response-${question_id}"
              class="jspsych-textarea-input" 
              name="${question_name}"
              rows="${question_essay_rows}"
              cols="${question_essay_cols}" ${question_essay_max_length} ${question_essay_placeholder} ${question_requirements}></textarea>
          `;
        }
        html += "</fieldset>";
      }
    }

    // 4. Modal HTML
    html += `
      <div id="jspsych-survey-overlay"></div>
      <div id="jspsych-confirm-popup">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div class="warning-icon">
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

    if (!trial.custom_html) {
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
        
        // 1. Logic for Number/Text/Textarea inputs
        const isTextInput = target.type === 'number' || target.type === 'text' || target.tagName === 'TEXTAREA';
        const isNotWriteIn = !target.classList.contains('jspsych-survey-html-form-writein');

        if (isTextInput && isNotWriteIn) {
          // If user has typed actual characters, remove 'incomplete'
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
    }

    // Form Submission
    const form = display_element.querySelector(".jspsych-survey-html-form") as HTMLFormElement;
    let forceSubmit = false;
    const startTime = performance.now();

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!trial.custom_html) {
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
      };

      this.jsPsych.finishTrial({ rt: Math.round(performance.now() - startTime), response: "" });
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

export default SurveyPlugin;