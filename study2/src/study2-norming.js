// randomize button order per participant
// move through task quicker if you skip through information
// pique your curiosity if you follow through on information -- heavily incentivize to skip
// problem is for the avoid context/mechanism. 

// HOW do we deconfound effort from avoiding?
// one way is we can show something else when they avoid -- like a neutral image or something filler.
// this is a strong test of avoid
import stimuli from './stimuli/norming-targets.json' with { type: 'json' }

// Import FontAwesome icons
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faPhone, faMousePointer, faArrowUpRightFromSquare, faCircleCheck, faCircleXmark, faChevronCircleRight, faChevronCircleDown, faArrowTurnUp, faArrowRight, faCircleArrowRight, faTriangleExclamation, faArrowRightToBracket} from '@fortawesome/free-solid-svg-icons';
library.add(faEnvelope, faPhone, faMousePointer, faArrowUpRightFromSquare, faCircleCheck, faCircleXmark, faChevronCircleRight, faChevronCircleDown, faArrowTurnUp, faArrowRight, faCircleArrowRight, faTriangleExclamation, faArrowRightToBracket);
dom.watch();

// Import jsPsych core and CSS
import { initJsPsych } from 'jspsych';
import 'jspsych/css/jspsych.css';
import './custom.css';

// Import core jsPsych plugins
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychWyLabSurvey from './plugins/plugin-wylab-survey';

// Import officially contributed jsPsych plugins
import jsPsychPipe from '@jspsych-contrib/plugin-pipe';


dom.watch();

// ---------------- PAGE 0 ---------------- //
// STUDY INITIALIZATION
// Define global variables
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

// Set up filename for debugging
const participantId = jsPsych.randomization.randomID(10);
const filename = `${participantId}.csv`;

// Set up filename for actual run
// const participantId = jsPsych.data.getURLVariable('PROLIFIC_PID');
// const studyId = jsPsych.data.getURLVariable('STUDY_ID');
// const sessionId = jsPsych.data.getURLVariable('SESSION_ID');
// const filename = `${participantId}` + "_" + `${studyId}` + "_" + `${sessionId}.csv`;

jsPsych.data.addProperties({
  participantId: participantId,
  // studyId: studyId,
  // sessionId: sessionId
});

// ---------------- PAGE 1 ---------------- //
// ENTER FULLSCREEN
const blockEnterFullscreen = {
  type: jsPsychFullscreen,
  name: 'enter_fullscreen',
  fullscreen_mode: true,
  delay_after: 0
};
// timeline.push(blockEnterFullscreen)

// ---------------- PAGE 2 ---------------- //
// CONSENT FORM
const blockConsentForm = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <section> 
      <h2 style="text-align: center"><strong>Consent Form</strong></h2>

      <p class="indented align-left">
        We are asking you to participate in a research study titled "Social Judgment and Decision-Making."
        We will describe this study to you and answer any of your questions. This form has information to help 
        you decide whether or not you wish to participate—please review it carefully. Your participation is voluntary. 
        This study is being led by Professor Jordan Wylie, Department of Psychology.
      </p>
    </section>

      <section>
        <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>What this study is about</strong></h3>
        <p class="indented align-left">
          The purpose of this research is to explore how people view and judge the actions of others. 
          You will not be made aware of the full nature or purpose of the research to maintain validity of the research, 
          but you will be fully debriefed at the end.
        </p>
      </section>

      <section>
        <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>What we will ask you to do</strong></h3>
        <p class="indented align-left">
          We will ask you to complete a study that takes approximately <strong>7 minutes</strong>. The study will include 
          demographic questions (e.g., age, gender), brief tasks or vignettes, and questions about your thoughts, 
          perceptions, and reactions. In some cases, you may be asked to read short stories or view images before answering questions.
        </p>
      </section>

      <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Risks and discomforts</strong></h3>
      <p class="indented align-left">
        Participants will be asked questions and encounter stimuli involving moral beliefs, which may be uncomfortable. 
        The images presented will include images from a standardized set, including gross and disgusting things 
        like rotten food and vomit as well as scary things like snakes and spiders. While there are measures put 
        in place by the researcher to secure data, there is always a risk of a potential breach of confidentiality. 
        Please tell the researchers if you believe you are harmed from your participation in the study. 
      </p>
      </section>

      <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Benefits</strong></h3>
      <p class="indented align-left">
        It is hoped that this study will contribute to knowledge about how people view and make judgements about others. 
        You are not expected to directly benefit from participation in the study.
      </p>
      </section>

      <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Incentives for participation</strong></h3>
      <p class="indented align-left">
        If participating through Prolific/Cloud, you will be paid <strong>$1.05 ($9.00/hour)</strong> for your participation in the study.
      </p>
      </section>
      
      <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Privacy, confidentiality, and data security</strong></h3>
      <p class="indented align-left">
        You will not be asked to provide information that could be used to identify you personally. 
        We anticipate that your participation in this survey presents no greater risk than everyday use of the Internet.<br>
      </p>
      </section>

      <section>
        <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Sharing de-identified data collected in this research</strong></h3>
        <p class="indented align-left">
          De-identified data from this study may be shared with the research community 
          at large to advance science and health. We will remove or code any personal 
          information that could identify you before files are shared with other researchers 
          to ensure that, by current scientific standards and known methods, no one will be 
          able to identify you from the information we share. Despite these measures, 
          we cannot guarantee anonymity of your personal data.
        </p>
      </section>

      <section>
        <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Taking part is voluntary</strong></h3>
        <p class="indented align-left">
          Please remember that your participation is voluntary. You may refuse to participate 
          before the study begins, discontinue at any time, or skip any questions/procedures 
          that may make you feel uncomfortable, with no penalty to you, and no effect on the 
          compensation earned before withdrawing.
        </p>
      </section>

      <section>
        <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>If you have questions</strong></h3>
        <p class="indented align-left">
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
      </section>
      
      <section>
      <p class="indented align-left" style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">
        <strong>Statement of consent</strong><br>
        I have read the above information, and have received answers to any questions I asked. 
        I consent to take part in the study. 
      </p>
      </section>`,
  questions: [
    { 
      name: 'consent',
      options: ["YES, I consent to participate in this study", "NO, I do not consent to participate in this study"],
      format: { type: 'radio' },
      requirements: { type: 'required' }
    }
  ],
  // If the participant does not consent, end the experiment
  on_finish: function (data) {
    if (data.response.consent == "NO, I do not consent to participate in this study") {
      jsPsych.data.addProperties({
        consent: "no"
      });

      jsPsych.abortExperiment(
        `
        <script>
          $(document).ready(function() {
            $('html, body').scrollTop(0);
          })
        </script>
        <p>
          You did not consent to participate in this study.<br>
          Please return this study in Prolific.
        </p>`
      );
    } else {
      jsPsych.data.addProperties({
        consent: "yes"
      });
    };
  }
};
timeline.push(blockConsentForm);

// ---------------- PAGE 3 ---------------- //
const instruction_pages = [
  // 1. Introduction
  `<p class="align-left">Welcome! Thank you for agreeing to participate 🙂</p>
  </br>
  <p class="align-left">
    In this study, we are interested in understanding how you think and feel about some <strong>real people</strong> from modern history.
    On each trial, you will first read a brief description of a historical figure and then answer five questions about your perceptions of each. 
  </p>`,

  // 2. Source Credibility
  `<p class="align-left">
    We carefully selected examples of <strong>real</strong>, <strong>relatively unknown</strong> people with credible historical information 
    collected from reliable primary and secondary online sources.
  </p>`,

  // 3. Study Design
  `<p class="align-left">
    There will be <strong>20 trials</strong> in total, so 20 people to evaluate. Please read each description carefully, and answer as honestly as possible.
    After completing all trials, you will answer some additional questions before receiving a debriefing.
  </p>`,

  // 4. Advance
  `<p class="align-left">
    When you are ready to begin, please click the <strong style="color: #0B6ED0;">Next Page</strong> button to advance!
  </p>`
];

// STUDY INSTRUCTIONS
// Define the trial structure
const pageInstructions = {
  type: jsPsychWyLabSurvey,
  preamble: jsPsych.timelineVariable('full_html'), 
  button_label: 'Next Page'
};

const blockInstructions = {
  timeline: [pageInstructions],
  timeline_variables: instruction_pages.map((currentContent, index) => {
    
    // 1. Retrieve all previous instructions
    const previousContent = instruction_pages.slice(0, index);
    
    // 2. Wrap previous instructions in the greyed-out class
    const greyedOutHTML = previousContent
      .map(html => `<section class="jspsych-instructions-greyed-out">${html}</section>`)
      .join('');

    // 3. Combine them: Greyed out stuff + current active stuff
    return {
      full_html: `
        <main class="jspsych-survey-html-form-preamble jspsych-instructions">
          <h2>Study Instructions</h2>
          ${greyedOutHTML}
          <section class="jspsych-instructions-active">
            ${currentContent}
          </section>
        </main>`
    };
  }),
  randomize_order: false
};

// timeline.push(blockInstructions);



// // ---------------- PAGE 4 ---------------- //
// // STUDY INSTRUCTIONS
// const blockComprehensionCheck = {
//   type: jsPsychWyLabSurvey,
//   preamble: `
//     <main>
//       <div class="jspsych-instructions">
//         <h2>Study Instructions</h2>
        
//         <p>Welcome! Thank you for agreeing to participate.</p> 
        
//         <p>
//           In this study, we are interested in understanding how you think and feel about some <strong>real people</strong> from modern history.
//           On each trial, you will first read a brief description of a historical figure and then answer some questions about your perceptions of them. 
//         </p>

//         <p>
//           There will be <strong>20 trials</strong> in total. Please read each description carefully, and answer as honestly as possible.
//           After completing all trials, you will answer some additional questions before receiving a debriefing.
//         </p>

//         <p>When you are ready to begin, please click the "Next Page" button below.</p>
//       </div>
//     </main>`,
//   questions: [
//     {
//       name: 'comprehension_check',
//       prompt: 'What will you be asked to do in this study?',
//       format: { type: 'radio' },
//       options: [
//         "Read descriptions of historical figures and answer questions about them",
//         "Watch videos and answer questions about them",
//         "Complete puzzles and answer questions about them"
//       ],
//       requirements: {
//         type: 'comprehension',
//         correct_answer: 'Read descriptions of historical figures and answer questions about them',
//       }
//     }
//   ],
//   button_label: 'Next Page'
// };
// timeline.push(blockComprehensionCheck);

// ---------------- PAGE 5 ---------------- //
// NORMING TASK
const mainTaskStimuli = Object.entries(stimuli).map(([name, details]) => ({
  target_name: name,
  target_morality: details.morality,
  intro: details.intro, 
  description: details.description,
  motive: details.motive
}));

const moralPool = mainTaskStimuli.filter(s => s.target_morality === 'moral');
const immoralPool = mainTaskStimuli.filter(s => s.target_morality === 'immoral');

/**
 * Assigns a group ID (0-4) to determine the stimuli slice.
 * Ideally, this comes from a database or a URL parameter like ?group=0
 */
const groupID = Math.floor(Math.random() * 5); 

function getSlice(n, pool, group) {
    // Each group starts at a specific index and takes 10 items
    // Using modulo (%) allows the selection to "wrap around" the 25-item array
    let selected = [];
    for (let trial_idx = 0; trial_idx < n; trial_idx++) {
        let index = (group * 5 + trial_idx) % pool.length;
        selected.push(pool[index]);
    }
    return selected;
}

const selectedMoral = getSlice(2, moralPool, groupID);
const selectedImmoral = getSlice(2, immoralPool, groupID);

// Combine and shuffle for the individual participant
const participantStimuli = jsPsych.randomization.shuffle([...selectedMoral, ...selectedImmoral]);

let norming_trial_count = 0; // Initialize at 0

const pageNorming = {
  type: jsPsychWyLabSurvey,
  preamble: jsPsych.timelineVariable('prompt'),
  questions: [
    {
      name: "morality",
      prompt: "How <strong>morally good or morally bad</strong> do you consider this person to be?",
      format: {
        type: 'slider',
        slider_direction: "bipolar",
        slider_starting_value: 50,
        slider_range: [0, 100],
        slider_color_scheme: "orange-purple",
        slider_anchors: {
          left: 'Extremely morally bad', 
          center: 'Neutral',
          right: 'Extremely morally good'
        },
      },
      requirements: { type: 'request' }
    },
    {
      name: "familiarity",
      prompt: "How <strong>familiar</strong> are you with this person?",
      format: {
        type: 'slider',
        slider_direction: "unipolar",
        slider_color_scheme: "purple",
        slider_starting_value: 0,
        slider_range: [0, 100],
        slider_anchors: {
          left: 'Not at all familiar',
          right: 'Extremely familiar'
        },
      },
      requirements: { type: 'request' }
    },
    {
      name: "uncertainty",
      prompt: "How <strong>certain</strong> are you about what you will read next about this person?",
      format: {
        type: 'slider',
        slider_direction: "unipolar",
        slider_color_scheme: "purple",
        slider_starting_value: 0,
        slider_range: [0, 100],
        slider_anchors: {
          left: 'Not at all certain',
          right: 'Extremely certain'
        },
      },
      requirements: { type: 'request' }
    },
    {
      name: "typicality",
      prompt: "How <strong>typical</strong> do you consider this person to be?",
      format: {
        type: 'slider',
        slider_direction: "unipolar",
        slider_color_scheme: "purple",
        slider_starting_value: 0,
        slider_range: [0, 100],
        slider_anchors: {
          left: 'Not at all typical',
          right: 'Extremely typical'
        },
      },
      requirements: { type: 'request' }
    },
    {
      name: "valence",
      prompt: "How <strong>positively or negatively</strong> do you feel about this person?",
      format: {
        type: 'slider',
        slider_direction: "bipolar",
        slider_color_scheme: "orange-purple",
        slider_starting_value: 50,
        slider_range: [0, 100],
        slider_anchors: {
          left: 'Extremely negative', 
          center: 'Neutral',
          right: 'Extremely positive'
        }
      },
      requirements: { type: 'request' }
    },
  ],
  button_label: 'Next Page',
  data: {
    target_name: jsPsych.timelineVariable('target_name'),
    target_morality: jsPsych.timelineVariable('target_morality')
  },
  on_finish: function(data) {
    norming_trial_count++;
    data.norming_trial_number = norming_trial_count;

    // Now you access it from data directly, not the timeline variable
    console.log(data);
    console.log(data.target_name);
    data.target_name = data.target_name;
    data.target_morality = data.target_morality;
    
    data.morality = data.response['morality'];
    data.familiarity = data.response['familiarity'];
    data.uncertainty = data.response['uncertainty'];
    data.typicality = data.response['typicality'];
    data.valence = data.response['valence'];
  }
};

const blockNorming = {
  timeline: [pageNorming],
  timeline_variables: participantStimuli.map(stimulus => ({
    prompt: `
      <p>Please read about the person below and answer the following questions:</p>
      <div class="norming-card aat-card active ${stimulus.target_morality === 'moral' ? 'norming-card-moral' : 'norming-card-immoral'}">
        <div style="padding: 0 20px 0;">  
          <h2><strong>${stimulus.target_name}</strong></h2>
          <p>${stimulus.intro}</p>
        </div>
        <div class="faded-text">
          <p>${stimulus.description}</p>
          <p>${stimulus.motive}</p>
        </div>
      </div>`,
    target_name: stimulus.target_name,
    target_morality: stimulus.target_morality
  })),
  randomize_order: true
};
// timeline.push(blockNorming);

// ---------------- PAGE 5 ---------------- //
// DEMOGRAPHICS
const blockFictionQuestion = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  questions: [
    {
      prompt: "How much <strong>popular fiction (TV shows, movies, books, etc.)</strong> do you consume?",
      name: 'fiction_consumption',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal'
      },
      options: ["1<br>None", "2", "3", "4", "5", "6", "7<br>A great deal"],
      requirements: { type: 'request' }
    },
  ],
  button_label: 'Next Page',
  on_finish: function(data) {
    const resp = data.response;
    data.fiction_consumption = resp['fiction_consumption'] || '';
  }
};
// timeline.push(blockFictionQuestion);


// ---------------- PAGE 6 ---------------- //
// DEMOGRAPHICS
const blockDemographicsQuestions = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  questions: [
    {
      prompt: "What is your age (in years)?",
      name: 'age',
      format: {
        type: 'number',
        min: 18,
        max: 120
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "With which gender do you identify?",
      name: 'gender',
      options: [
        "Woman",
        "Man",
        "Non-binary",
        "Other:",
        "Prefer not to disclose"
      ],
      write_in: ["Other:"],
      format: { 
        type: 'radio',
        orientation: 'vertical',
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "Where would you place yourself on the political spectrum, overall?",
      name: 'politics',
      format: {
        type: 'slider',
        slider_direction: "bipolar",
        slider_color_scheme: "blue-red",
        slider_starting_value: 50,
        slider_range: [0, 100],
        slider_anchors: {
          left: 'Left-wing<br>(Liberal)', 
          center: 'Center', 
          right: 'Right-wing<br>(Conservative)'
        }
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "Please indicate how you identify yourself:",
      name: 'race-ethnicity',
      options: [
        "White",
        "African or African-American",
        "Hispanic/Latine",
        "Asian or Asian-American",
        "Indigenous American or Alaskan Native",
        "Native Hawaiian or other Pacific Islander",
        "Other:", 
        "Prefer not to disclose"
      ],
      write_in: ["Other:"],
      format: {
        type: 'checkbox',
        selection: 'multiple'
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "To what extent do you consider yourself to be religious?",
      name: 'religion',
      options: ["Not at all religious", "Slightly religious", "Moderately religious", "Very religious"],
      format: {
        type: 'radio',
        mc_orientation: 'horizontal'
      },
      requirements: { type: 'request' }
    }
  ],
  button_label: 'Next Page',
  on_finish: function(data) {
    jsPsych.data.addProperties({
      age: data.response['age'],
      gender: data.response['gender'],
      gender_writein: data.response['gender-writein'] || '',
      politics: data.response['politics'],
      race_ethnicity: Array.isArray(data.response['race-ethnicity']) ? data.response['race-ethnicity'].join(", ") : data.response['race-ethnicity'],
      religion: data.response['religion']
    });
  }
};

timeline.push(blockDemographicsQuestions);

const blockAttention = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <section>
    <h2 style="text-align: center"><strong>Study Debriefing</strong></h2>
    <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>What was this study about?</strong></h3>
    <p class="indented align-left">
      Our research lab is broadly interested in moral psychology—that is, better understanding the ways that moral judgments, moral states, and moral values, alongside other states, influence cognition and memory. Below are some of the specific questions we are currently exploring:
    </p>
    </section>
    <section>
    <ul>
      <li>How do moral states influence judgments, decision-making, and broader cognition?</li>
      <li>Do moral judgments and blame affect judgments, cognition, and memory?</li>
      <li>How does moral information influence the extent to which rules and rule-breakers should be punished?</li>
    </ul>
    </section>
    <section>
    <p class="indented align-left">
      Your participation helps us answer these questions, which in turn has implications for public figures, policy, and law. We are committed to sharing our research findings in ways that are accessible and relevant to the public.
    </p>
    </section>
    <section>
    <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>How to contact us</strong></h3>
    <p class="indented align-left">
      Feel free to visit our website <a href="https://www.jordancwylie.com/"><i class="fa-solid fa-mouse-pointer fa-xs"></i>&nbsp;jordancwylie.com</a> to learn more about our research. If you have any concerns or questions about the study you just completed, please reach out to the lab <a href="mailto:jordan.wylie@cornell.edu"><i class="fa-solid fa-envelope fa-xs"></i>&nbsp;jordan.wylie@cornell.edu</a>.
    </p>
    </section>
    <section>
    <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>To learn more about your rights as a research participant</strong></h3>
    <p class="indented align-left">
      If you have any concerns about research-related ethics or harm, or would like to learn more about the ethical constraints under which this study was conducted, 
      please contact the Cornell University Institutional Review Board (IRB) for Human Participants <a href="tel:16072556182"><i class="fa-solid fa-phone fa-xs"></i>&nbsp;+1&nbsp;(607)&nbsp;255-6182</a> or access their website <a href="https://researchservices.cornell.edu/offices/IRB"><i class="fa-solid fa-mouse-pointer fa-xs"></i>&nbsp;researchservices.cornell.edu/offices/IRB</a>. Thank you for your participation!
    </p>
    </section>`,
  questions: [
    {
      prompt: `
        <hr>
        We appreciate your response to this question. Please be honest when answering, as your answer WILL NOT affect your payment or eligibility for future studies.
        <br><br>
        <strong>Overall, how much attention did you pay to this study while you were taking it?</strong>
      `,
      name: 'attention',
      options: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Completely"],
      format: {
        type: 'radio',
        mc_orientation: 'horizontal'
      },
      requirements: { type: 'request' }
    }
  ],
  request_response: true,
  on_finish: function (data) {
    switch (data.response['attention']) {
      case "1<br>Not at all":
        data.attention_num = 1;
        break;
      case "2":
        data.attention_num = 2;
        break;
      case "3":
        data.attention_num = 3;
        break;
      case "4":
        data.attention_num = 4;
        break;
      case "5":
        data.attention_num = 5;
        break;
      case "6":
        data.attention_num = 6;
        break;
      case "7<br>Completely":
        data.attention_num = 7;
        break;
    }
    data.attention = data.response['attention'];
  }
};
timeline.push(blockAttention);

// ---------------- PAGE 7 ---------------- //
// COMMENTS AND FEEDBACK
const blockFeedback = {
  type: jsPsychWyLabSurvey,
  questions: [
    {
      format: { 
        type: "essay",
        rows: 10,
        columns: 40
      },
      name: 'feedback',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
          Please use this space for any additional thoughts or comments.<br>
          <span style="font-size: 10pt;">
            We read everything and appreciate your feedback!
          </span>
        </p>`,
    }
  ],
  on_finish: function (data) {
    data.feedback = data.response['feedback'];
  }
};
timeline.push(blockFeedback);


// ---------------- END EXPERIMENT ---------------- //
// EXIT FULLSCREEN
const exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0,
};
timeline.push(exitFullscreen);

// DataPipe conclude data collection
const blockSaveData = {
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
      <p>
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

timeline.push(blockSaveData);

startExperiment();

// Function to initialize the experiment
function startExperiment() {
  jsPsych.run(timeline);
};