// randomize button order per participant
// move through task quicker if you skip through information
// pique your curiosity if you follow through on information -- heavily incentivize to skip
// problem is for the avoid context/mechanism. 

// HOW do we deconfound effort from avoiding?
// one way is we can show something else when they avoid -- like a neutral image or something filler.
// this is a strong test of avoid

import $ from 'jquery';
import { initJsPsych } from 'jspsych';
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faPhone, faArrowUpRightFromSquare, faCircleCheck, faCircleXmark, faChevronCircleRight, faChevronCircleDown, faArrowTurnUp, faArrowRight, faPersonMilitaryPointing } from '@fortawesome/free-solid-svg-icons';
library.add(faEnvelope, faPhone, faArrowUpRightFromSquare, faCircleCheck, faCircleXmark, faChevronCircleRight, faChevronCircleDown, faArrowTurnUp, faArrowRight);
dom.watch();

import 'jspsych/css/jspsych.css';
import './custom.css';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychInstructions from '@jspsych/plugin-instructions';
import jsPsychSurveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import jsPsychSurveyHtmlForm from './plugins/plugin-survey-html-form';

import jsPsychSurveyLikert from '@jspsych/plugin-survey-likert';
import jsPsychSurveyText from '@jspsych/plugin-survey-text';
import jsPsychPipe from '@jspsych-contrib/plugin-pipe';
import { jsPsychApproachAvoidTaskPlugin } from './plugins/plugin-approach-avoid';


// DEFINE GLOBAL VARIABLES
let timeline = [];

// jsPsych Initialization
var jsPsych = initJsPsych({
  use_webaudio: false,
  display_element: 'jspsych-target',
  auto_preload: true,
  show_progress_bar: true,
  default_iti: 0,
  on_finish: function (data) {
    jsPsych.data.displayData('csv');
  }  
});

// const participantId = jsPsych.data.getURLVariable('PROLIFIC_PID');
// const studyId = jsPsych.data.getURLVariable('STUDY_ID');
// const sessionId = jsPsych.data.getURLVariable('SESSION_ID');
// const filename = `${participantId}` + "_" + `${studyId}` + "_" + `${sessionId}.csv`;

const participantId = jsPsych.randomization.randomID(10);
const filename = `${participantId}.csv`;

jsPsych.data.addProperties({
  participantId: participantId,
  // studyId: studyId,
  // sessionId: sessionId
});

// Political Ideology
const politicalResponses = [
  "1 (Extremely liberal)",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 (Extremely conservative)",
];

// attention check
const attention_scale = [
  "1 = No, I didnt pay close attention. You should not use my data",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 = Yes, I paid full attention. You should use my data",
];

// ---------------- PAGE 1 ---------------- //
// ENTER FULLSCREEN 
const enterFullscreen = {
  type: jsPsychFullscreen,
  name: 'enter_fullscreen',
  fullscreen_mode: true,
  delay_after: 0
};

// timeline.push(enterFullscreen)

// ---------------- PAGE 2 ---------------- //
// CONSENT FORM //
const consentForm = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'consent',
      prompt: `
            <p>
              We are asking you to participate in a research study titled "Social Judgment and Decision-Making."
              We will describe this study to you and answer any of your questions. This form has information to help 
              you decide whether or not you wish to participate—please review it carefully. Your participation is voluntary. 
              This study is being led by Professor Jordan Wylie, Department of Psychology.
            </p>

            <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>What this study is about</strong></h3>
            <p class="indented">
              The purpose of this research is to explore how people view and judge the actions of others. 
              You will not be made aware of the full nature or purpose of the research to maintain validity of the research, 
              but you will be fully debriefed at the end.
            </p>

            <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>What we will ask you to do</strong></h3>
            <p class="indented">
              We will ask you to complete a study that takes approximately <strong>7 minutes</strong>. The study will include 
              demographic questions (e.g., age, gender), brief tasks or vignettes, and questions about your thoughts, 
              perceptions, and reactions. In some cases, you may be asked to read short stories or view images before answering questions.
            </p>

            <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Risks and discomforts</strong></h3>
            <p class="indented">
              Participants will be asked questions and encounter stimuli involving moral beliefs, which may be uncomfortable. 
              The images presented will include images from a standardized set, including gross and disgusting things 
              like rotten food and vomit as well as scary things like snakes and spiders. While there are measures put 
              in place by the researcher to secure data, there is always a risk of a potential breach of confidentiality. 
              Please tell the researchers if you believe you are harmed from your participation in the study. 
            </p>

            <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Benefits</strong></h3>
            <p class="indented">
              It is hoped that this study will contribute to knowledge about how people view and make judgements about others. 
              You are not expected to directly benefit from participation in the study.
            </p>
            <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Incentives for participation</strong></h3>
            <p class="indented">
              If participating through Prolific/Cloud, you will be paid <strong>$1.05 (rate of $9.00/hour)</strong> for your participation in the study.
            </p>
            <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Privacy, confidentiality, and data security</strong></h3>
            <p class="indented">
              You will not be asked to provide information that could be used to identify you personally. 
              We anticipate that your participation in this survey presents no greater risk than everyday use of the Internet.<br>
            </p>
            <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Sharing de-identified data collected in this research</strong></h3>
            <p class="indented">
              De-identified data from this study may be shared with the research community 
              at large to advance science and health. We will remove or code any personal 
              information that could identify you before files are shared with other researchers 
              to ensure that, by current scientific standards and known methods, no one will be 
              able to identify you from the information we share. Despite these measures, 
              we cannot guarantee anonymity of your personal data.
            </p>
            <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Taking part is voluntary</strong></h3>
            <p class="indented">
              Please remember that your participation is voluntary. You may refuse to participate 
              before the study begins, discontinue at any time, or skip any questions/procedures 
              that may make you feel uncomfortable, with no penalty to you, and no effect on the 
              compensation earned before withdrawing.
            </p>
            <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>If you have questions</strong></h3>
            <p class="indented">
              The main researcher conducting this study is Jordan Wylie, a professor at Cornell University. 
              Please ask any questions you have now. If you have questions later, you may contact Professor 
              Jordan Wylie <a href="mailto:jordan.wylie@cornell.edu"><i class="fa-solid fa-envelope fa-xs"></i>&nbsp;jordan.wylie@cornell.edu</a>&nbsp;or <a href="tel:16072554486"><i class="fa-solid fa-phone fa-xs"></i>&nbsp;+1&nbsp;(607)&nbsp;255-4486</a>. If you have any questions or concerns regarding 
              our rights as a subject in this study, you may contact the Institutional Review Board (IRB) for 
              Human Participants <a href="tel:16072556182"><i class="fa-solid fa-phone fa-xs"></i>&nbsp;+1&nbsp;(607)&nbsp;255-6182</a> or access their 
              website <a href="https://researchservices.cornell.edu/offices/IRB" rel="noopener" target="_blank">https://researchservices.cornell.edu/offices/IRB&nbsp;<i class="fa-solid fa-arrow-up-right-from-square fa-xs"></i></a>. 
              You may also report your concerns or complaints anonymously online via 
              NAVEX <a href="http://www.hotline.cornell.edu" rel="noopener" target="_blank"><i class="fa-solid fa-envelope fa-xs"></i>&nbsp;www.hotline.cornell.edu</a>
              or by calling toll free <a href="tel:18662933077"><i class="fa-solid fa-phone fa-xs"></i>&nbsp;+1&nbsp;(866)&nbsp;293-3077</a>. NAVEX is an independent organization
               that serves as a liaison between the University and the person bringing the complaint 
               so that anonymity can be ensured.
            </p>
            <p style="text-align: left; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">
              <strong>Statement of consent</strong><br>
              I have read the above information, and have received answers to any questions I asked. 
              I consent to take part in the study. 
            </p>`,
      options: ["YES, I consent to participate in this study", "NO, I do not consent to participate in this study"],
      horizontal: false,
      required: true
    }
  ],
  preamble: '<h2 style="text-align: center"><strong>Consent Form</strong></h2>',

  // If the participant does not consent, end the experiment
  on_finish: function (data) {
    if (jsPsych.data.get().last(1).values()[0].response.consent == "NO, I do not consent to participate in this study") {
      jsPsych.abortExperiment(
        `<p class="jspsych-center">
          You did not consent to participate in this study.<br>
          Please return this study in Prolific.
        </p>`
      );
    }
  }
};

// timeline.push(consentForm);

// ---------------- PAGE 3 ---------------- //
// Define Instructions
const instructions = {
  type: jsPsychInstructions,
  pages: [
    `<div style="text-align: center;">
       <p>In this study, we are interested in who you are curious to learn <strong>more</strong> or <strong>less</strong> about.
       Your task is to select the one that makes you most curious for more information about them. 
       You will only get one opportunity to select one person to learn about, so make sure you choose the one who is most interesting to you!</p>
     </div>`
  ],
  show_clickable_nav: true
};

// Build Timeline
// timeline.push(instructions);


/* define welcome message trial */
var welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Welcome to the experiment. Press any key to begin."
};
// timeline.push(welcome);

const approachAvoidInstructions = {
  type: jsPsychInstructions,
  pages: [
    `<div style="text-align: center;">
       <p>Now, you will see a series of cards. For each card, you will see a </p>
       <p>If you are very curious to learn more about them, you will move the slider 
       to the right. If you are not at all curious to learn more about them, you will 
       move the slider to the left.</p>
       <p>There is no right or wrong answer—just indicate how curious you are to learn 
       more about each person.</p>
     </div>`
  ],
  show_clickable_nav: true,
  button_label_next: 'Next Page'
};

timeline.push(approachAvoidInstructions);


var trial = {
  type: jsPsychApproachAvoidTaskPlugin,
  trial_duration_seconds: 1,
  num_cards: 16,
  prompt_text: "Would you like to read more?",
  continue_button_text: ["Yes", "No"]
};

timeline.push(trial)


// ---------------- PAGE 6 ---------------- //
// DEMOGRAPHICS
const demographicsQuestions = {
  type: jsPsychSurveyHtmlForm,
  preamble: `<p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  questions: [
    {
      prompt: "What is your age (in years)?",
      name: 'age',
      format: 'number',
      min: 18,
      max: 120,
      // requirements: 'request'
    },
    {
      prompt: "With which gender do you identify?",
      name: 'gender',
      format: 'radio',
      options: [
        "Woman",
        "Man",
        "Non-binary",
        "Other:",
        "Prefer not to disclose"
      ],
      write_in: ["Other:"],
      // requirements: 'request',
      orientation: 'vertical'
    },
    {
      prompt: "Where would you place yourself on the political spectrum, overall?",
      name: 'politics',
      format: 'slider',
      anchors: 
        {
          left: 'Left-wing<br>(Liberal)', 
          center: 'Center', 
          right: 'Right-wing<br>(Conservative)'
        }
      ,
      starting_value: 50,
      range: [0, 100],
      // requirements: 'request'
    },
    {
      prompt: "Please indicate how you identify yourself:",
      name: 'race-ethnicity',
      format: 'checkbox',
      options: [
        "White",
        "African or African-American",
        "Hispanic/Latine",
        "Asian or Asian-American",
        "Indigenous American or Alaskan Native",
        "Native Hawaiian or other Pacific Islander",
        "Other", 
        "Prefer not to disclose"
      ],
      write_in: [],
      selection: 'multiple',
      orientation: 'vertical'
      // requirements: 'request',
    },
    {
      prompt: "To what extent do you consider yourself to be religious?",
      name: 'religion',
      format: 'radio',
      options: [
        "Not at all religious",
        "Slightly religious",
        "Moderately religious",
        "Very religious"
      ],
      write_in: [],
      orientation: 'horizontal'
      // requirements: 'request'
    }
  ],

  button_label: 'Next Page',
  on_finish: function(data) {
    const resp = data.response;

    data.age = Number(resp['age']);
    data.race_ethnicity_indigenous = resp['race-ethnicity-indigenous'] || '';
    data.race_ethnicity_asian = resp['race-ethnicity-asian'] || '';
    data.race_ethnicity_black = resp['race-ethnicity-black'] || '';
    data.race_ethnicity_native = resp['race-ethnicity-native'] || '';
    data.race_ethnicity_white = resp['race-ethnicity-white'] || '';
    data.race_ethnicity_hispanic = resp['race-ethnicity-hispanic'] || '';
    data.race_ethnicity_other = resp['race-ethnicity-other'] || '';
    data.race_ethnicity_na = resp['race-ethnicity-prefer-not'] || '';

    data.gender = resp['gender'] || '';
    data.education = resp['education'] || '';
  }
};

timeline.push(demographicsQuestions);

const politicsQuestions = {
  type: jsPsychSurveyHtmlForm,
  preamble: null,
  questions: [
    {
      prompt: `
        We appreciate your response to this question. Please be honest when answering, as your answer WILL NOT affect your payment or eligibility for future studies.
        <br><br>
        <strong>Overall, how much attention did you pay to this study while you were taking it?</strong>
      `,
      name: 'attention',
      format: 'radio',
      options: [
        "1<br>(Not at all)",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7<br>(Completely)"
      ],
      write_in: [],
      selection: 'multiple',
      requirements: 'request',
      orientation: 'horizontal'
    }
  ],
  request_response: true,
  on_finish: function (data) {

    data.political_ideology_economic = data.response['political-ideology-economic'];
    data.political_ideology_social = data.response['political-ideology-social'];
    data.political_ideology_overall = data.response['political-ideology-overall'];
 
  }
};

timeline.push(politicsQuestions);

// Comments
const feedback = {
  type: jsPsychSurveyText,
  questions: [
    {
      name: 'feedback',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
          Please use this space for any additional thoughts or comments.<br>
          <span style="font-size: 10pt;">
            We read everything and appreciate your feedback!
          </span>
        </p>`,
      rows: 10
    }
  ],
  on_finish: function (data) {
    data.feedback = data.response['feedback'];
  }
}

timeline.push(feedback);

// Exit fullscreen
const exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0
};

timeline.push(exitFullscreen);

// DataPipe conclude data collection
const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: "RzZhZYnwuCi2",
  filename: filename,
  data_string: () => jsPsych.data.get().csv(),

  on_finish: function(data) {

    // --- countdown timer ---
    function countdown(start, end) {
      const timer = setInterval(function() {
        if (start <= end) {
          clearInterval(timer);
        } else {
          start--;
          $("#countdown").html(start);
        }
      }, 1000);
    }
    countdown(5, 0);

    // --- abortExperiment screen ---
    jsPsych.abortExperiment(`
      <p class="jspsych-center">
        Thanks for participating! You will be redirected in
        <span id="countdown">5</span> seconds...
      </p>
      <p style="color: red;"><strong>DO NOT CLOSE THIS PAGE BEFORE YOU ARE REDIRECTED.</strong></p>
    `);

    // --- redirect after 5 seconds ---
    setTimeout(function () {
      window.location.href =
        "https://app.prolific.com/submissions/complete?cc=XXXX";
    }, 5000);
  }
};

timeline.push(save_data);

startExperiment();

// Function to initialize the experiment; will be called once all images are preloaded
function startExperiment() {
  jsPsych.run(timeline);
};