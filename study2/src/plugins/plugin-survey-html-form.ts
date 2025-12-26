// import $ from 'jquery';
// import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

// const info = <const>{
//   name: "survey-html-form",
//   version: "1.0.0",
//   parameters: {
//     /** Whether to use custom HTML for the form. */
//     custom_html: {
//       type: ParameterType.BOOL,
//       default: false,
//     },
//     /** HTML formatted string to display at the top of the page above all the questions. */
//     preamble: {
//       type: ParameterType.HTML_STRING,
//       default: null,
//     },
//     /** The text that appears on the button to finish the trial. */
//     button_label: {
//       type: ParameterType.STRING,
//       default: "Next Page",
//     },
//     /** Whether to request a response from the participant before proceeding. */
//     request_response: {
//       type: ParameterType.BOOL,
//       default: true,
//     },
//     /** The HTML element ID of a form field to autofocus on. */
//     autofocus: {
//       type: ParameterType.STRING,
//       default: "",
//     },
//     /** Retrieve the data as an array e.g. [{name: "INPUT_NAME", value: "INPUT_VALUE"}, ...] instead of an object e.g. {INPUT_NAME: INPUT_VALUE, ...}. */
//     dataAsArray: {
//       type: ParameterType.BOOL,
//       default: false,
//     },
//     /** Setting this to true will enable browser auto-complete or auto-fill for the form. */
//     autocomplete: {
//       type: ParameterType.BOOL,
//       default: false,
//     },
//   },
//   data: {
//     /**  An object containing the response for each input. The object will have a separate key (variable) for the response to each input, with each variable being named after its corresponding input element. Each response is a string containing whatever the participant answered for this particular input. This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions. */
//     response: {
//       type: ParameterType.OBJECT,
//     },
//     /** The response time in milliseconds for the participant to make a response. */
//     rt: {
//       type: ParameterType.INT,
//     },
//   },
//   // prettier-ignore
//   citations: '__CITATIONS__',
// };

// type Info = typeof info;

/**
 *
 * The survey-html-form plugin displays a set of `<inputs>` from a HTML string. The type of input can be freely
 * chosen, for a list of possible input types see the [MDN page on inputs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).
 * The participant provides answers to the input fields.
 * @author Nathan Liang, Jan Simson
 * @see {@link https://www.jspsych.org/latest/plugins/survey-html-form/ survey-html-form plugin documentation on jspsych.org}
 */



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
  constructor(private jsPsych: JsPsych) { }

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    var html = "";
    if (trial.preamble !== null) {
      html += `<div id="jspsych-survey-html-form-preamble" class="jspsych-survey-html-form-preamble">${trial.preamble}</div>`;
    }

    html += `<form class="jspsych-survey-html-form" autocomplete="${trial.autocomplete ? 'on' : 'off'}">`;

    if (trial.custom_html) {
      html += trial.html;
    }

    // Logic for Question Generation
    var question_order = Array.from(trial.questions.keys());
    if (trial.randomize_question_order) {
      question_order = this.jsPsych.randomization.shuffle(question_order);
    }

    for (var i = 0; i < question_order.length; i++) {
      var question = trial.questions[question_order[i] as unknown as number];
      var question_id = `jspsych-survey-html-form-question-${i}`;
      var question_format = question.format;
      var slider_direction = question.direction || 'bipolar';
      html += `<fieldset class="jspsych-survey-html-form-question-${question.background ? 'minimal' : 'rich'} incomplete" id="${question_id}">`;

      if (question_format == "slider") {
        html += `
          <label class="jspsych-survey-html-form-prompt">${question.prompt}</label>
          <input 
            id="slider-${question_id}"
            class="jspsych-slider incomplete" 
            name="${question.name}" 
            type="range" 
            data-starting-value="${question.starting_value}"
            min="${question.range[0]}" max="${question.range[1]}" step="${question.range[2] || 1}" 
            onmousedown="this.setAttribute('data-touched', 'true'); this.classList.remove('incomplete'); this.classList.add('${slider_direction}-clicked');"
          >
          <div class="jspsych-slider-anchor-container">
            <span class="jspsych-slider-left-anchor">${question.anchors.left}</span>
            <span class="jspsych-slider-center-anchor">${question.anchors.center || ''}</span>
            <span class="jspsych-slider-right-anchor">${question.anchors.right}</span>
          </div>`;
      } else if (question_format == "radio" || question_format == "checkbox") {
        html += `<p class="jspsych-survey-html-form-prompt">${question.prompt}</p>`;
        var orientation = question.orientation || 'vertical';
        html += `<div class="jspsych-survey-html-form-options-container-${orientation}" role="${question_format}group">`;
        
        for (let j = 0; j < question.options.length; j++) {
          var option_id = `${question_id}-opt-${j}`;
          html += `
            <label class="jspsych-survey-html-form-${question_format}-option-${orientation}" for="${option_id}">
              <input type="${question_format}" name="${question.name}" id="${option_id}" value="${question.options[j]}">
              <span>${question.options[j]}</span>
            </label>`;
        }
        html += `</div>`;
      }
      html += "</fieldset>";
    }

    // Modal HTML must be part of the string BEFORE injection
    html += `
      <div id="jspsych-survey-overlay"></div>
      <div id="jspsych-confirm-popup"">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="border-radius: 50%; background-color: #fff3cd; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center; margin-top: 10px;">
            <i class="fa-solid fa-triangle-exclamation" style="color: gold"></i>
          </div>
          <h2>Are you sure?</h2>
        </div>
        <p style="text-align: center">There is at least one unanswered question.<br>Would you like to continue?</p>
        <button type="button" id="confirm-yes" class="jspsych-btn" style="margin-right:10px;">Answer Question(s)</button>
        <button type="button" id="confirm-no" class="jspsych-btn">Continue Without Answering</button>
      </div>`;

    html += `<div style="display: flex; justify-content: right;"><button type="submit" id="jspsych-survey-html-form-next" class="jspsych-btn">${trial.button_label} <i class="fa-solid fa-circle-arrow-right"></i></button></div></form>`;
    
    display_element.innerHTML = html;

    // Post-injection: Initialize Slider Visuals
    // 2. IMMEDIATELY set the visual position of sliders to the starting value
    // This prevents the browser from defaulting to 50
    display_element.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(s => {
      const startVal = s.getAttribute('data-starting-value');
      if (startVal !== null) {
        s.value = startVal; // This sets the visual handle position
      }
    });

    var form_element = display_element.querySelector(".jspsych-survey-html-form") as HTMLFormElement;
    let forceSubmit = false;
    var startTime = performance.now();

    form_element.addEventListener("submit", (event) => {
      event.preventDefault();

      // 1. Check for incompletes FIRST (without touching the slider values yet)
      const incompleteElements = display_element.querySelectorAll(".incomplete");
      
      if (trial.request_response && incompleteElements.length > 0 && !forceSubmit) {
        // Show Modal
        (display_element.querySelector("#jspsych-survey-overlay") as HTMLElement).style.display = "block";
        (display_element.querySelector("#jspsych-confirm-popup") as HTMLElement).style.display = "block";

        display_element.querySelector("#confirm-yes")!.addEventListener("click", () => {
          (display_element.querySelector("#jspsych-survey-overlay") as HTMLElement).style.display = "none";
          (display_element.querySelector("#jspsych-confirm-popup") as HTMLElement).style.display = "none";
        }, { once: true });

        display_element.querySelector("#confirm-no")!.addEventListener("click", () => {
          forceSubmit = true;
          form_element.dispatchEvent(new Event('submit'));
        }, { once: true });

        return; // Exit here; sliders remain at their visual starting positions
      }

      // 2. Final Data Collection (Only reached if moving to next trial)
      
      // NOW clear untouched sliders just before serialization
      display_element.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(s => {
        if (s.getAttribute('data-touched') !== 'true') {
            s.value = ""; 
        }
      });

      const response_time = Math.round(performance.now() - startTime);
      const raw_data = serializeArray(form_element);
      
      let final_data = trial.dataAsArray ? raw_data : objectifyForm(raw_data);

      if (!trial.dataAsArray) {
        trial.questions.forEach((q: any) => {
          if (!(q.name in final_data)) final_data[q.name] = null;
        });
      }

      this.jsPsych.finishTrial({ rt: response_time, response: final_data });
    });

    // Event listener to remove 'incomplete' class on input change
    display_element.addEventListener("change", (e) => {
      const target = e.target as HTMLElement;
      if (target.matches("input")) target.closest("fieldset")?.classList.remove("incomplete");
    });

    function serializeArray(form: HTMLFormElement) {
      var serialized: any[] = [];
      for (var i = 0; i < form.elements.length; i++) {
        var field = form.elements[i] as any;
        if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].includes(field.type)) continue;
        if (field.type === 'select-multiple') {
          for (var n = 0; n < field.options.length; n++) {
            if (field.options[n].selected) serialized.push({ name: field.name, value: field.options[n].value });
          }
        } else if ((field.type !== "checkbox" && field.type !== "radio") || field.checked) {
          if (field.value !== "") serialized.push({ name: field.name, value: field.value });
        }
      }
      return serialized;
    }

    function objectifyForm(formArray: any[]) {
      var obj: any = {};
      formArray.forEach(item => {
        if (item.name in obj) {
          obj[item.name] = Array.isArray(obj[item.name]) ? [...obj[item.name], item.value] : [obj[item.name], item.value];
        } else {
          obj[item.name] = item.value;
        }
      });
      return obj;
    }
  }
}

export default SurveyHtmlFormPlugin;