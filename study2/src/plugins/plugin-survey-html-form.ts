import $ from 'jquery';
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

const info = <const>{
  name: "survey-html-form",
  version: "1.0.0",
  parameters: {
    /** Whether to use custom HTML for the form. */
    custom_html: {
      type: ParameterType.BOOL,
      default: false,
    },
    /** HTML formatted string to display at the top of the page above all the questions. */
    preamble: {
      type: ParameterType.HTML_STRING,
      default: null,
    },
    /** The text that appears on the button to finish the trial. */
    button_label: {
      type: ParameterType.STRING,
      default: "Next Page",
    },
    /** The HTML element ID of a form field to autofocus on. */
    autofocus: {
      type: ParameterType.STRING,
      default: "",
    },
    /** Retrieve the data as an array e.g. [{name: "INPUT_NAME", value: "INPUT_VALUE"}, ...] instead of an object e.g. {INPUT_NAME: INPUT_VALUE, ...}. */
    dataAsArray: {
      type: ParameterType.BOOL,
      default: false,
    },
    /** Setting this to true will enable browser auto-complete or auto-fill for the form. */
    autocomplete: {
      type: ParameterType.BOOL,
      default: false,
    },
  },
  data: {
    /**  An object containing the response for each input. The object will have a separate key (variable) for the response to each input, with each variable being named after its corresponding input element. Each response is a string containing whatever the participant answered for this particular input. This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions. */
    response: {
      type: ParameterType.OBJECT,
    },
    /** The response time in milliseconds for the participant to make a response. */
    rt: {
      type: ParameterType.INT,
    },
  },
  // prettier-ignore
  citations: '__CITATIONS__',
};

type Info = typeof info;

/**
 *
 * The survey-html-form plugin displays a set of `<inputs>` from a HTML string. The type of input can be freely
 * chosen, for a list of possible input types see the [MDN page on inputs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).
 * The participant provides answers to the input fields.
 * @author Nathan Liang, Jan Simson
 * @see {@link https://www.jspsych.org/latest/plugins/survey-html-form/ survey-html-form plugin documentation on jspsych.org}
 */
class SurveyHtmlFormPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) { }

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    var html = "";
    // show preamble text
    if (trial.preamble !== null) {
      html +=
        '<div id="jspsych-survey-html-form-preamble" class="jspsych-survey-html-form-preamble">' +
        trial.preamble +
        "</div>";
    }
    // start form
    if (trial.autocomplete) {
      html += '<form class="jspsych-survey-html-form" autocomplete="on">';
    } else {
      html += '<form class="jspsych-survey-html-form" autocomplete="off">';
    }

    // add form HTML / input elements
    if (trial.custom_html) {
      html += trial.html;
    }



    var question_order = [];
    for (var i = 0; i < trial.questions.length; i++) {
      question_order.push(i);
    }
    if (trial.randomize_question_order) {
      question_order = this.jsPsych.randomization.shuffle(question_order);
    }

    for (var question_num = 0; question_num < trial.questions.length; question_num++) {

      // get question based on question_order
      var question = trial.questions[question_order[question_num]];   // <- very important line
      var question_format = question.format;
      var question_writein = question.write_in || [];
      var question_required = question.required || false;


      var question_id = `jspsych-survey-html-form-question-${question_num}`;
      var question_classes = ["jspsych-survey-html-form-question"];

      if (question.horizontal) {
        question_classes.push("jspsych-survey-html-form-question-horizontal");
      }

      if (question.background) {
        html += `<fieldset class="jspsych-survey-html-form-question-minimal incomplete" id=${question_id}">`;
      } else {
        html += `<fieldset class="jspsych-survey-html-form-question-rich incomplete" id=${question_id}">`;
      }

      // SLIDER
      if (question_format == "slider") {
        var slider_prompt = question.prompt;
        var slider_name = question.name;
        var slider_id = question_id;
        var slider_anchors = question.anchors;
        var slider_starting_value = question.starting_value;
        var slider_seq = question.range;
        html += `
          <label class="jspsych-survey-html-form-prompt" for="jspsych-survey-html-form-response-${slider_id}">${slider_prompt}</label>
          <input 
            id="jspsych-survey-html-form-response-${slider_id}"
            class="jspsych-slider incomplete" 
            name="${slider_name}" 
            type="range" 
            value="${slider_starting_value}" min="${slider_seq[0]}" max="${slider_seq[1]}" step="${slider_seq[2] || 1}" 
            onmousedown="
              this.classList.remove('incomplete');
              this.classList.add('bipolar-clicked');
              document.getElementById('jspsych-survey-html-form-response-${slider_id}')
            "
          >
            <div class="jspsych-slider-anchor-container">
              <span class="jspsych-slider-left-anchor">
                ${slider_anchors['left']}
              </span>
              <span class="jspsych-slider-center-anchor">
                ${slider_anchors['center']}
              </span>
              <span class="jspsych-slider-right-anchor">
                ${slider_anchors['right']}
              </span>
            </div>`
      } else if (question_format == "radio" || question_format == "checkbox") {
        
        // MULTIPLE CHOICE OR SELECT
        html += `
          <p class="jspsych-survey-html-form-prompt">${question.prompt}</p>`

        var question_orientation = question.orientation || 'vertical';
        html += `<div class="jspsych-survey-html-form-options-container-${question_orientation}" role="${question_format}group" aria-labelledby="${question_id}">`;
        

        // create option radio buttons
        for (let option_num = 0; option_num < question.options.length; option_num++) {
          // add label and question text
          var option_name = question.name || `jspsych-survey-html-form-question-${question_num}-${question_format}-option`;
          var option_id = `jspsych-survey-html-form-question-${question_num}-${question_format}-option-${option_num}`;
          var required_attr = question.required ? "" : "req";

          html += `
            <label class="jspsych-survey-html-form-${question_format}-option-${question_orientation}" for="${option_id}">
              <span id="${option_id}-${question_format}-button-${question_orientation}" class="${question_format}-button"></span>
              <input type="${question_format}" role="${question_format}" name="${option_name}" id="${option_id}" value="${question.options[option_num]}" ${required_attr}>
              <span class="${question_format}-button-label-${question_orientation}">${question.options[option_num]}</span>`;

          if (question.write_in.includes(question.options[option_num])) {
            // write-in option
            html += `
              <div class="jspsych-survey-html-form-writein-container">
                <input type="text" id="${option_id}-writein" name="${option_name}-writein" class="jspsych-survey-html-form-writein" placeholder="">
              </div>`;
          }
          // <i class="fa-solid fa-arrow-turn-up" style="transform: rotate(90deg); color: gray;"></i>
          html += `</label>`;
        }
        html += `</div>`;
      } else if (question_format == "number") {
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



    // add submit button
    html +=
      `<div style="display: flex; justify-content: right !important;">
        <input type="submit" id="jspsych-survey-html-form-next" class="jspsych-btn jspsych-survey-html-form" style="width: max-content;" value="${trial.button_label}">
      </div>`;
    //

    html += "</form>";
    display_element.innerHTML = html;

    // After the HTML is injected into the display_element
    const container = display_element.querySelector(
      '.jspsych-survey-html-form-options-container-horizontal'
    ) as HTMLElement;

    if (container) {
      const count = container.children.length;
      container.style.setProperty('--option-count', count.toString());
    }


    // Define the SVG content outside the loop as before
    var svg_icon_html = '<span class="checkmark-svg"><svg aria-hidden="true" data-icontype="Check" height="1rem" viewBox="0 0 24 24" width="1rem" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.8062 7.37181C18.0841 7.67897 18.0603 8.15325 17.7532 8.43115L9.8782 15.5562C9.59605 15.8114 9.16747 15.815 8.88113 15.5644L5.88113 12.9394C5.5694 12.6667 5.53782 12.1928 5.81058 11.8811C6.08334 11.5694 6.55716 11.5378 6.86889 11.8106L9.36667 13.9961L16.7468 7.31885C17.054 7.04094 17.5283 7.06466 17.8062 7.37181Z"></path></svg></span>';

    // Get all parent <label> elements for the radio/checkbox options
    var labels = display_element.querySelectorAll<HTMLLabelElement>(
      `.jspsych-survey-html-form-radio-option-horizontal, 
      .jspsych-survey-html-form-checkbox-option-horizontal, 
      .jspsych-survey-html-form-radio-option-vertical, 
      .jspsych-survey-html-form-checkbox-option-vertical`
    );

    labels.forEach(function(label) {
        // 1. Initial SVG Insertion
        var radioVisual = label.querySelector('.radio-button, .checkbox-button');
        if (radioVisual) {
            radioVisual.insertAdjacentHTML('beforeend', svg_icon_html);
        }

        // 2. Attach the Click Listener
        label.addEventListener('change', function(e) {
            
            // Find the actual input element and assert its type
            var input = label.querySelector('input[type="radio"], input[type="checkbox"]') as HTMLInputElement;
            if (!input) return;

            const isRadio = input.type === 'radio';
            const isCheckbox = input.type === 'checkbox';

            // --- CORE LOGIC START ---

            if (isRadio) {
                // Radio: Manage mutual exclusivity visuals and ensure input is checked
                
                // Step 1: Remove 'selected' from all siblings
                var groupName = input.name;
                var allInputsInGroup = display_element.querySelectorAll(`input[name="${groupName}"]`) as NodeListOf<HTMLInputElement>;
                allInputsInGroup.forEach(function(i) {
                    i.closest('label')?.classList.remove('selected');
                });
                
                // Step 2: Ensure this input is checked (this is likely unnecessary now but safe to keep)
                input.checked = true; 
                
                // Step 3: Add 'selected' class to this label
                label.classList.add('selected');

            } else if (isCheckbox) {
                if (input.checked) {
                    label.classList.add('selected');
                } else {
                    label.classList.remove('selected');
                }
            }

            // --- CORE LOGIC END ---
        });

        // 3. Initial check for pre-selected options (e.g., if re-running the trial)
        var initialInput = label.querySelector('input[type="radio"], input[type="checkbox"]') as HTMLInputElement;
        if (initialInput && initialInput.checked) {
            label.classList.add('selected');
        }
    });


    // check if question is incomplete on submit
    display_element.addEventListener("change", (event) => {
      var target = event.target as HTMLElement;
      if (target.matches("input")) {
        var fieldset = target.closest("fieldset");
        if (fieldset) {
          fieldset.classList.remove("incomplete");
        }
      }
    });

  

    if (trial.autofocus !== "") {
      var focus_elements = display_element.querySelectorAll<HTMLInputElement>(
        "#" + trial.autofocus
      );
      if (focus_elements.length === 0) {
        console.warn("No element found with id: " + trial.autofocus);
      } else if (focus_elements.length > 1) {
        console.warn('The id "' + trial.autofocus + '" is not unique so autofocus will not work.');
      } else {
        focus_elements[0].focus();
      }
    }

    var form_element = display_element.querySelector(".jspsych-survey-html-form");

    if (form_element) {
      form_element.addEventListener("submit", (event) => {
        // don't submit form
        event.preventDefault();

        // measure response time
        var endTime = performance.now();
        var response_time = Math.round(endTime - startTime);

        var this_form = display_element.querySelector(".jspsych-survey-html-form");
        var question_data = serializeArray(this_form); // This holds the raw ARRAY [{name: 'X', value: 'Y'}, ...]

        // 1. Initialize the variable outside the conditional block
        // We use 'any' or 'Record<string, any>' to accommodate the object structure
        let final_grouped_data: any; 

        if (!trial.dataAsArray) {
            // Case 1: trial.dataAsArray is false (or undefined) - Process to an OBJECT and fill nulls

            // Get the list of all expected top-level question names
            const expected_names = trial.questions.map((q: any) => q.name).filter((n: any) => n !== undefined);
            
            // Group the raw array data into an object (using the modified objectifyForm)
            final_grouped_data = objectifyForm(question_data); // Assigns the object here

            // Fill in missing question names with null
            for (const name of expected_names) {
                if (!(name in final_grouped_data)) {
                    final_grouped_data[name] = null;
                }
            }
        } else {
            // Case 2: trial.dataAsArray is true - Save the raw array data
            // In this case, we save the raw array output from serializeArray() as the response.
            // Note: If you use the array format, the null-filling logic is typically applied later in
            // your analysis pipeline, as the array format doesn't easily support 'null' keys.
            final_grouped_data = question_data; 
        }

        // save data
        var trialdata = {
            rt: response_time,
            response: final_grouped_data, // 'final_grouped_data' is now guaranteed to be assigned
        };

        // next trial
        // if (display_element.querySelectorAll(".incomplete").length > 0) {
        //   alert(" Please answer all required questions before continuing.");
        //   return;
        // }
        this.jsPsych.finishTrial(trialdata);
      });
    }

    var startTime = performance.now();

    /**
     * Serialize all form data into an array
     * @copyright (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
     * @param  {Node}   form The form to serialize
     * @return {String}      The serialized form data
     */
    function serializeArray(form: Element | null) {
      // Setup our serialized data
      var serialized = [];

      // Loop through each field in the form
      const formElement = form as HTMLFormElement;
      for (var i = 0; i < formElement.elements.length; i++) {
        var field = formElement.elements[i] as HTMLFormElement;

        // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
        if (
          !field.name ||
          field.disabled ||
          field.type === "file" ||
          field.type === "reset" ||
          field.type === "submit" ||
          field.type === "button"
        )
          continue;

        // If a multi-select, get all selections
        if (field.type === "select-multiple") {
          for (var n = 0; n < field.options.length; n++) {
            if (!field.options[n].selected) continue;
            serialized.push({
              name: field.name,
              value: field.options[n].value,
            });
          }
        }

        // Convert field data to a query string
        else if ((field.type !== "checkbox" && field.type !== "radio") || field.checked) {
          serialized.push({
            name: field.name,
            value: field.value,
          });
        }
      }

      return serialized;
    }

    function objectifyForm(formArray: any[]) {
      var returnObject = <any>{};
      for (var i = 0; i < formArray.length; i++) {
        const { name, value } = formArray[i];
        
        if (name in returnObject) {
          if (Array.isArray(returnObject[name])) {
            // Key exists and is already an array (for multiple selections), push the new value
            returnObject[name].push(value);
          } else {
            // Key exists as a single value, convert to an array and add both
            returnObject[name] = [returnObject[name], value];
          }
        } else {
          // Key does not exist, assign the value
          returnObject[name] = value;
        }
      }
      return returnObject;
    }
  }
}

export default SurveyHtmlFormPlugin;
