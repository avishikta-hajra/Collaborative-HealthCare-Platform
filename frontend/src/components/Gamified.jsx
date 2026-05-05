import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, PlayCircle, Trophy, Timer } from 'lucide-react';
import Confetti from 'react-confetti';

/* ============================================================================
 * MOCK DATA: QUIZ REPOSITORY
 * Categorized health-related questions. Each object contains the question, 
 * four options, the correct answer, and an educational explanation.
 * ============================================================================ */
const quizData = {
    "nutrition": [
        {
            question: "Which vitamin is primarily responsible for boosting the immune system and healing wounds?",
            options: ["Vitamin A", "Vitamin C", "Vitamin B12", "Vitamin K"],
            correctAnswer: "Vitamin C",
            explanation: "Vitamin C is a powerful antioxidant that helps protect cells and maintains healthy skin, blood vessels, and immunity."
        },
        {
            question: "What is the main physiological benefit of dietary fiber?",
            options: ["Improves digestion", "Builds muscle mass", "Improves night vision", "Increases heart rate"],
            correctAnswer: "Improves digestion",
            explanation: "Dietary fiber normalizes bowel movements and helps maintain bowel health, lowering the risk of digestive conditions."
        },
        {
            question: "Which mineral is essential for maintaining strong bones and teeth?",
            options: ["Iron", "Zinc", "Calcium", "Sodium"],
            correctAnswer: "Calcium",
            explanation: "Over 99% of the body's calcium is stored in the bones and teeth, providing structural strength and support."
        },
        {
            question: "Omega-3 fatty acids, which promote heart and brain health, are predominantly found in:",
            options: ["Fatty fish", "White rice", "Red meat", "Apples"],
            correctAnswer: "Fatty fish",
            explanation: "Fatty fish like salmon, mackerel, and sardines are rich sources of EPA and DHA Omega-3 fatty acids."
        },
        {
            question: "Dehydration can lead to which common immediate symptom?",
            options: ["Hair loss", "Fatigue and dizziness", "High blood sugar", "Weight gain"],
            correctAnswer: "Fatigue and dizziness",
            explanation: "A lack of adequate hydration drops blood volume, leading to poor circulation, fatigue, and lightheadedness."
        },
        {
            question: "Which macronutrient is the most calorie-dense per gram?",
            options: ["Proteins", "Carbohydrates", "Fats", "Fiber"],
            correctAnswer: "Fats",
            explanation: "Fats contain 9 calories per gram, whereas proteins and carbohydrates contain only 4 calories per gram."
        },
        {
            question: "What is an excellent plant-based source of complete protein?",
            options: ["Carrots", "Quinoa", "White bread", "Celery"],
            correctAnswer: "Quinoa",
            explanation: "Quinoa is a unique plant food because it contains all nine essential amino acids, making it a complete protein."
        },
        {
            question: "Iron absorption from plant sources is significantly enhanced by consuming it with which vitamin?",
            options: ["Vitamin D", "Vitamin C", "Vitamin E", "Vitamin A"],
            correctAnswer: "Vitamin C",
            explanation: "Vitamin C captures non-heme iron and stores it in a form that your body's cells can absorb much more easily."
        },
        {
            question: "Which B vitamin is primarily found naturally only in animal products?",
            options: ["Vitamin B1", "Vitamin B6", "Vitamin B12", "Folic Acid"],
            correctAnswer: "Vitamin B12",
            explanation: "Vitamin B12 is naturally found in animal foods. Vegans and vegetarians often need to consume fortified foods or supplements."
        },
        {
            question: "High sodium intake is most closely linked to an increased risk of which health issue?",
            options: ["High blood pressure", "Low blood sugar", "Asthma", "Osteoporosis"],
            correctAnswer: "High blood pressure",
            explanation: "Excess sodium causes the body to retain water, putting an extra burden on the heart and blood vessels."
        },
    ],
    "physical-health": [
        {
            question: "What is the standard recommended duration for moderate-intensity aerobic exercise per week?",
            options: ["60 minutes", "90 minutes", "120 minutes", "150 minutes"],
            correctAnswer: "150 minutes",
            explanation: "Global health organizations recommend at least 150 minutes of moderate aerobic exercise (like brisk walking) per week."
        },
        {
            question: "Which vital sign measures the force of blood against the artery walls?",
            options: ["Heart rate", "Respiratory rate", "Blood pressure", "Body temperature"],
            correctAnswer: "Blood pressure",
            explanation: "Blood pressure is the pressure of circulating blood against the walls of blood vessels. Normal is typically around 120/80 mmHg."
        },
        {
            question: "What does a pulse oximeter primarily measure?",
            options: ["Blood sugar", "Oxygen saturation in blood", "White blood cell count", "Cholesterol levels"],
            correctAnswer: "Oxygen saturation in blood",
            explanation: "A pulse oximeter is a non-invasive device used to quickly measure the oxygen saturation level (SpO2) of the blood."
        },
        {
            question: "In the context of physical health, what does 'sedentary' mean?",
            options: ["Highly active", "Spending much time seated/inactive", "Eating a balanced diet", "Lifting heavy weights"],
            correctAnswer: "Spending much time seated/inactive",
            explanation: "A sedentary lifestyle involves very little or no physical activity, which greatly increases the risk of chronic diseases."
        },
        {
            question: "Which of these is a widely recognized benefit of regular cardiovascular exercise?",
            options: ["Reduces bone density", "Strengthens the heart muscle", "Increases resting heart rate", "Impairs lung function"],
            correctAnswer: "Strengthens the heart muscle",
            explanation: "Cardio makes your heart muscle stronger, allowing it to pump blood more efficiently with fewer beats."
        },
        {
            question: "How long should a typical warm-up session last before intense exercise?",
            options: ["1-2 minutes", "5-10 minutes", "30-40 minutes", "1 hour"],
            correctAnswer: "5-10 minutes",
            explanation: "A 5-10 minute warm-up increases blood flow to muscles and raises body temperature, reducing the risk of injury."
        },
        {
            question: "What is the most reliable tool to monitor core body temperature at home?",
            options: ["Touching the forehead", "Digital thermometer", "Pulse oximeter", "Blood pressure monitor"],
            correctAnswer: "Digital thermometer",
            explanation: "Digital thermometers provide fast, highly accurate readings of a person's core body temperature."
        },
        {
            question: "Muscle hypertrophy refers to:",
            options: ["Loss of muscle mass", "Increase in muscle size", "Muscle spasms", "Tearing a muscle"],
            correctAnswer: "Increase in muscle size",
            explanation: "Hypertrophy is the growth and increase of the size of muscle cells, usually achieved through strength training."
        },
        {
            question: "Which activity is considered a weight-bearing exercise that helps improve bone density?",
            options: ["Swimming", "Cycling", "Brisk walking", "Sitting"],
            correctAnswer: "Brisk walking",
            explanation: "Weight-bearing exercises force you to work against gravity, which stimulates bone formation and density."
        },
        {
            question: "What is the recommended amount of daily sleep for an average adult to maintain optimal health?",
            options: ["4-5 hours", "7-9 hours", "10-12 hours", "As much as possible"],
            correctAnswer: "7-9 hours",
            explanation: "Adults need 7-9 hours of restorative sleep to regulate hormones, repair tissues, and consolidate memory."
        },
    ],
    "mental-health": [
        {
            question: "Telepsychiatry can be effectively used to treat which of the following?",
            options: [
                "Broken bones",
                "Anxiety and Depression",
                "Severe physical trauma",
                "Dental cavities",
            ],
            correctAnswer: "Anxiety and Depression",
            explanation: "Telepsychiatry provides remote mental health assessments and therapy, highly effective for anxiety and depression management."
        },
        {
            question: "What does the practice of 'mindfulness' involve?",
            options: [
                "Worrying about the future",
                "Focusing on the present moment without judgment",
                "Multitasking constantly",
                "Ignoring emotional pain",
            ],
            correctAnswer: "Focusing on the present moment without judgment",
            explanation: "Mindfulness brings your attention to the internal and external experiences occurring in the present moment."
        },
        {
            question: "Chronic stress can physically impact the body by chronically elevating which hormone?",
            options: ["Melatonin", "Insulin", "Cortisol", "Estrogen"],
            correctAnswer: "Cortisol",
            explanation: "Cortisol is the primary stress hormone. Prolonged high levels can disrupt sleep, digestion, and immunity."
        },
        {
            question: "A severe panic attack often shares acute physical symptoms with which medical emergency?",
            options: ["Common cold", "Heart attack", "Sprained ankle", "Food poisoning"],
            correctAnswer: "Heart attack",
            explanation: "Panic attacks can cause severe chest pain, shortness of breath, and a racing heart, mimicking a heart attack."
        },
        {
            question: "Which practice is clinically proven to improve sleep quality and reduce insomnia?",
            options: ["Drinking caffeine late", "Establishing a regular bedtime routine", "Scrolling on a phone in bed", "Sleeping in late every day"],
            correctAnswer: "Establishing a regular bedtime routine",
            explanation: "A consistent sleep hygiene routine regulates the body's internal clock (circadian rhythm), improving sleep quality."
        },
        {
            question: "What is a common early sign of professional burnout?",
            options: ["Increased enthusiasm", "Emotional exhaustion and cynicism", "Desire to take on more work", "Perfect attendance"],
            correctAnswer: "Emotional exhaustion and cynicism",
            explanation: "Burnout manifests as profound physical and emotional exhaustion, often leading to detachment from one's job."
        },
        {
            question: "Cognitive Behavioral Therapy (CBT) primarily focuses on:",
            options: ["Prescribing medications", "Changing negative thought patterns", "Physical physical therapy", "Analyzing dreams"],
            correctAnswer: "Changing negative thought patterns",
            explanation: "CBT helps patients identify and change destructive or disturbing thought patterns that negatively influence behavior."
        },
        {
            question: "Seasonal Affective Disorder (SAD) is most commonly experienced during which seasons?",
            options: ["Spring and Summer", "Fall and Winter", "Only in Summer", "Year-round"],
            correctAnswer: "Fall and Winter",
            explanation: "SAD is a type of depression related to changes in seasons, most often beginning in fall and continuing into winter due to less sunlight."
        },
        {
            question: "Empathy in a healthcare and clinical setting refers to:",
            options: ["Feeling sorry for a patient", "Understanding and sharing the feelings of a patient", "Ignoring patient complaints", "Only treating physical symptoms"],
            correctAnswer: "Understanding and sharing the feelings of a patient",
            explanation: "Clinical empathy involves understanding the patient's emotional state and communicating that understanding effectively."
        },
        {
            question: "Prolonged social isolation is a known risk factor for:",
            options: ["Improved immunity", "Cognitive decline and depression", "Increased bone density", "Better vision"],
            correctAnswer: "Cognitive decline and depression",
            explanation: "Lack of social interaction has been heavily linked to increased risks of dementia, depression, and even cardiovascular disease."
        },
    ],
    "lifestyle-diseases": [
        {
            question: "Type 2 Diabetes is primarily characterized by the body's inability to effectively use:",
            options: ["Oxygen", "Adrenaline", "Insulin", "Calcium"],
            correctAnswer: "Insulin",
            explanation: "In Type 2 Diabetes, the body develops insulin resistance, causing glucose to build up in the bloodstream instead of entering cells."
        },
        {
            question: "Which dietary modification is most effective in managing hypertension (high blood pressure)?",
            options: ["Eating more sugar", "Reducing sodium intake", "Drinking less water", "Increasing trans fats"],
            correctAnswer: "Reducing sodium intake",
            explanation: "High sodium levels cause the body to retain excess fluid, which dramatically increases blood pressure against vessel walls."
        },
        {
            question: "Obesity is a major lifestyle risk factor for developing which respiratory condition?",
            options: ["Common cold", "Sleep apnea", "Pneumonia", "Tuberculosis"],
            correctAnswer: "Sleep apnea",
            explanation: "Excess weight around the neck can restrict the airway during sleep, leading to obstructive sleep apnea."
        },
        {
            question: "Atherosclerosis involves the dangerous buildup of what substance inside the arteries?",
            options: ["Water", "Red blood cells", "Plaque/Cholesterol", "Muscle tissue"],
            correctAnswer: "Plaque/Cholesterol",
            explanation: "Plaque (made of fat, cholesterol, and calcium) hardens and narrows arteries, restricting blood flow and risking heart attacks."
        },
        {
            question: "What is the leading preventable cause of chronic obstructive pulmonary disease (COPD)?",
            options: ["Eating junk food", "Smoking", "Lack of sleep", "Drinking soda"],
            correctAnswer: "Smoking",
            explanation: "Cigarette smoking is by far the most significant risk factor for developing COPD and severe lung tissue damage."
        },
        {
            question: "A 'sedentary lifestyle' significantly increases the risk of which broad disease category?",
            options: ["Infectious diseases", "Cardiovascular disease", "Genetic disorders", "Autoimmune diseases"],
            correctAnswer: "Cardiovascular disease",
            explanation: "A lack of physical activity weakens the heart muscle, increases arterial plaque, and contributes heavily to heart disease."
        },
        {
            question: "Elevated LDL levels in a lipid profile test indicate a higher risk of:",
            options: ["Heart disease", "Diabetes", "Asthma", "Osteoarthritis"],
            correctAnswer: "Heart disease",
            explanation: "LDL is often called 'bad' cholesterol because high levels lead to plaque buildup in your arteries."
        },
        {
            question: "Metabolic syndrome is a dangerous cluster of conditions that includes:",
            options: ["High blood pressure, high blood sugar, excess body fat", "Low blood pressure, anemia, fatigue", "Asthma, eczema, allergies", "Arthritis, osteoporosis, joint pain"],
            correctAnswer: "High blood pressure, high blood sugar, excess body fat",
            explanation: "Having these conditions together exponentially increases your risk of heart disease, stroke, and type 2 diabetes."
        },
        {
            question: "Which of these is considered a NON-modifiable risk factor for lifestyle diseases?",
            options: ["Diet", "Physical activity", "Smoking habits", "Genetics/Family history"],
            correctAnswer: "Genetics/Family history",
            explanation: "While diet and exercise can be changed, you cannot change your genetic predisposition or family medical history."
        },
        {
            question: "Regular health screenings are crucial for managing lifestyle diseases because:",
            options: ["They cure the disease instantly", "They often have no early symptoms", "They replace the need for a healthy diet", "They are mandatory by law"],
            correctAnswer: "They often have no early symptoms",
            explanation: "Conditions like hypertension and high cholesterol are 'silent killers' because they damage the body without obvious symptoms for years."
        },
    ],
    "wcd": [
        {
            question: "Folic acid supplementation is heavily prescribed during early pregnancy to prevent:",
            options: ["Morning sickness", "Neural tube defects", "Gestational diabetes", "High blood pressure"],
            correctAnswer: "Neural tube defects",
            explanation: "Folic acid helps form the neural tube. Adequate intake prevents major birth defects of the baby's brain and spine."
        },
        {
            question: "The World Health Organization (WHO) recommends exclusive breastfeeding for the first:",
            options: ["3 months", "6 months", "1 year", "2 years"],
            correctAnswer: "6 months",
            explanation: "Exclusive breastfeeding for 6 months provides optimal nutrition and antibodies, deeply protecting infants against common childhood illnesses."
        },
        {
            question: "Which routine screening is essential for the early detection of cervical cancer in women?",
            options: ["Mammogram", "Pap smear", "Bone density scan", "Colonoscopy"],
            correctAnswer: "Pap smear",
            explanation: "A Pap smear tests for precancerous cells on the cervix, heavily increasing the chances of successfully preventing cervical cancer."
        },
        {
            question: "Gestational diabetes is a condition that occurs specifically during:",
            options: ["Childhood", "Menopause", "Pregnancy", "Adolescence"],
            correctAnswer: "Pregnancy",
            explanation: "Gestational diabetes develops during pregnancy in women who didn't already have diabetes, requiring careful management."
        },
        {
            question: "What is colostrum?",
            options: ["A type of formula", "The first milk produced after birth, rich in antibodies", "A vitamin supplement", "A pregnancy hormone"],
            correctAnswer: "The first milk produced after birth, rich in antibodies",
            explanation: "Colostrum is the highly nutritious, antibody-rich first fluid produced by mothers, acting as the baby's first vaccine."
        },
        {
            question: "Oral polio drops are administered to children to prevent which type of infection?",
            options: ["Bacterial", "Fungal", "Viral", "Parasitic"],
            correctAnswer: "Viral",
            explanation: "Polio is a highly infectious viral disease that can cause irreversible paralysis. The vaccine builds crucial immunity."
        },
        {
            question: "Menopause typically marks the natural decline of which reproductive hormone?",
            options: ["Testosterone", "Estrogen", "Insulin", "Adrenaline"],
            correctAnswer: "Estrogen",
            explanation: "During menopause, a woman's ovaries stop releasing eggs and significantly decrease the production of estrogen and progesterone."
        },
        {
            question: "What is a common sign of postpartum depression?",
            options: ["Mild fatigue for one day", "Severe mood swings and difficulty bonding with the baby", "Increased appetite", "Instant return to pre-pregnancy weight"],
            correctAnswer: "Severe mood swings and difficulty bonding with the baby",
            explanation: "Unlike the brief 'baby blues,' postpartum depression is a severe, long-lasting clinical depression requiring medical support."
        },
        {
            question: "Iron supplements are commonly prescribed to pregnant women to primarily prevent:",
            options: ["Nausea", "Anemia", "High blood pressure", "Hair loss"],
            correctAnswer: "Anemia",
            explanation: "During pregnancy, blood volume increases significantly. Iron supplements prevent maternal anemia and support fetal blood supply."
        },
        {
            question: "The 'Kangaroo Mother Care' technique, often used for premature babies, involves:",
            options: ["Feeding them formula", "Skin-to-skin contact with the newborn", "Keeping them in a cold room", "Swaddling them tightly in blankets away from the mother"],
            correctAnswer: "Skin-to-skin contact with the newborn",
            explanation: "Skin-to-skin contact stabilizes the premature baby's heart rate, temperature, and breathing, and promotes breastfeeding."
        },
    ],
    "first-aid": [
        {
            question: "If someone is suddenly unresponsive and not breathing normally, what is the absolute first step?",
            options: ["Give them water", "Call emergency services/112", "Check their temperature", "Move them to a bed"],
            correctAnswer: "Call emergency services/112",
            explanation: "Activating emergency medical services (like calling an ambulance via HealthBridge) is critical before beginning chest compressions."
        },
        {
            question: "What does the 'Golden Hour' refer to in medical emergencies?",
            options: ["The time a doctor takes a break", "The first 60 minutes after a traumatic injury", "The time to take daily vitamins", "The ideal time to sleep"],
            correctAnswer: "The first 60 minutes after a traumatic injury",
            explanation: "The Golden Hour is the crucial window following a trauma where prompt medical and surgical treatment prevents death."
        },
        {
            question: "What is the primary purpose of 'triage' in an emergency setting?",
            options: ["Billing patients", "Prioritizing patient treatment based on severity", "Discharging patients", "Scheduling follow-ups"],
            correctAnswer: "Prioritizing patient treatment based on severity",
            explanation: "Triage is the medical sorting of patients according to their need for care, ensuring critical cases are treated immediately."
        },
        {
            question: "An EpiPen is a critical emergency device used to treat which severe medical condition?",
            options: ["Asthma attack", "Anaphylaxis/Severe allergic reaction", "Heart attack", "Seizure"],
            correctAnswer: "Anaphylaxis/Severe allergic reaction",
            explanation: "An EpiPen injects epinephrine, which rapidly counteracts the severe, life-threatening symptoms of an allergic reaction."
        },
        {
            question: "What does the acronym FAST stand for in identifying a potential stroke?",
            options: ["First, Action, Stop, Think", "Face, Arms, Speech, Time", "Fever, Ache, Sweat, Throat", "Find, Assess, Secure, Treat"],
            correctAnswer: "Face, Arms, Speech, Time",
            explanation: "Face drooping, Arm weakness, Speech difficulty, means it's Time to call emergency services instantly."
        },
        {
            question: "When a patient is bleeding heavily from a traumatic wound, the immediate first aid response is to:",
            options: ["Wait for an ambulance", "Apply direct pressure", "Pour water on it", "Elevate the legs only"],
            correctAnswer: "Apply direct pressure",
            explanation: "Applying firm, direct pressure with a clean cloth is the fastest and most effective way to stop severe external bleeding."
        },
    ],
    "digital-health": [
        {
            question: "In a telemedicine consultation, what is the most important information to provide the doctor first?",
            options: ["Your height", "Current symptoms and vital signs", "Your childhood allergies", "Your daily step count"],
            correctAnswer: "Current symptoms and vital signs",
            explanation: "Clear reporting of primary symptoms and vitals (like temperature) helps the virtual doctor quickly triage your condition."
        },
        {
            question: "Electronic Health Records (EHR) improve patient care primarily by:",
            options: ["Providing comprehensive and accessible medical history", "Reducing hospital bills", "Diagnosing patients automatically", "Replacing physical doctors"],
            correctAnswer: "Providing comprehensive and accessible medical history",
            explanation: "EHRs give doctors instant access to your past history, allergies, and lab results, allowing for faster and safer clinical decisions."
        },
        {
            question: "What does HIPAA primarily protect in healthcare?",
            options: ["Doctor salaries", "Patient data privacy and security", "Hospital equipment", "Health insurance costs"],
            correctAnswer: "Patient data privacy and security",
            explanation: "HIPAA is a federal law that requires the creation of national standards to protect sensitive patient health information from being disclosed without consent."
        },
        {
            question: "Which device is commonly worn by patients to track daily physical activity and heart rate remotely?",
            options: ["MRI Scanner", "Smartwatch/Fitness tracker", "Ultrasound machine", "X-ray machine"],
            correctAnswer: "Smartwatch/Fitness tracker",
            explanation: "Wearable health technology provides continuous real-time data, helping doctors monitor chronic conditions and fitness levels remotely."
        },
        {
            question: "What is a major advantage of using digital e-prescriptions over paper ones?",
            options: ["They are always free", "Reduces handwriting errors and improves pharmacy coordination", "They never expire", "They don't require a doctor's approval"],
            correctAnswer: "Reduces handwriting errors and improves pharmacy coordination",
            explanation: "E-prescriptions transmit directly to the pharmacy, eliminating misinterpretation of doctor handwriting and speeding up dispensing."
        },
    ],
    "senior-care": [
        {
            question: "What is a common environmental hazard that increases the risk of falls for seniors at home?",
            options: ["Carpeted floors", "Loose rugs and poor lighting", "Large windows", "Indoor plants"],
            correctAnswer: "Loose rugs and poor lighting",
            explanation: "Tripping hazards like loose rugs, clutter, and inadequate lighting are the leading causes of dangerous falls among the elderly."
        },
        {
            question: "Polypharmacy, a common issue in geriatrics, refers to:",
            options: ["Using multiple pharmacies", "Taking multiple medications simultaneously", "A type of physical therapy", "Allergic reactions to drugs"],
            correctAnswer: "Taking multiple medications simultaneously",
            explanation: "Polypharmacy increases the risk of adverse drug interactions and side effects, making medication management critical for seniors."
        },
        {
            question: "Which of the following is an early warning sign of Alzheimer's disease?",
            options: ["Occasional forgetfulness", "Memory loss that disrupts daily life", "Needing reading glasses", "Occasional joint pain"],
            correctAnswer: "Memory loss that disrupts daily life",
            explanation: "While occasional forgetfulness is normal aging, memory loss that affects daily functioning and problem-solving is an early indicator of dementia."
        },
        {
            question: "What type of exercise is highly recommended for seniors to maintain mobility and prevent falls?",
            options: ["Heavy weightlifting", "Marathon running", "Balance and strength training", "High-intensity interval training"],
            correctAnswer: "Balance and strength training",
            explanation: "Low-impact balance exercises like Tai Chi and light strength training help maintain muscle mass and stabilize posture."
        },
        {
            question: "Osteoporosis primarily makes seniors more susceptible to:",
            options: ["Heart attacks", "Bone fractures", "Vision loss", "Hearing loss"],
            correctAnswer: "Bone fractures",
            explanation: "Osteoporosis causes bones to become weak and brittle, meaning even a minor fall or stress can cause severe fractures."
        },
    ],
    "preventive-care": [
        {
            question: "A routine lipid panel blood test primarily measures:",
            options: ["Blood sugar", "Cholesterol and triglyceride levels", "White blood cells", "Iron levels"],
            correctAnswer: "Cholesterol and triglyceride levels",
            explanation: "Lipid panels check for total cholesterol, LDL (bad), HDL (good), and triglycerides to assess cardiovascular risk."
        },
        {
            question: "At what age is it generally recommended for average-risk women to start getting regular mammograms?",
            options: ["20 years old", "30 years old", "40 years old", "60 years old"],
            correctAnswer: "40 years old",
            explanation: "Most medical guidelines suggest women begin discussing and scheduling regular screening mammograms at age 40 to detect breast cancer early."
        },
        {
            question: "The HbA1c test is a crucial routine screening for monitoring which condition?",
            options: ["Anemia", "Diabetes", "Liver disease", "Kidney failure"],
            correctAnswer: "Diabetes",
            explanation: "The HbA1c test measures average blood sugar levels over the past 2-3 months, diagnosing and monitoring diabetes."
        },
        {
            question: "Colonoscopy is the gold standard screening test for preventing:",
            options: ["Stomach ulcers", "Colorectal cancer", "Appendicitis", "Liver cancer"],
            correctAnswer: "Colorectal cancer",
            explanation: "A colonoscopy can detect and remove precancerous polyps before they turn into cancer, making it highly effective for prevention."
        },
        {
            question: "How often should adults typically get their blood pressure checked if they have normal readings?",
            options: ["Every 5 years", "At least once a year", "Every month", "Only when feeling sick"],
            correctAnswer: "At least once a year",
            explanation: "Blood pressure can change without symptoms. Annual checks ensure early detection of hypertension, a major risk factor for heart disease."
        },
    ],
    "dental-health": [
        {
            question: "How often does the American Dental Association recommend brushing your teeth?",
            options: ["Once a day", "Twice a day", "After every meal", "Once a week"],
            correctAnswer: "Twice a day",
            explanation: "Brushing twice a day with fluoride toothpaste for two minutes helps remove plaque and prevents tooth decay."
        },
        {
            question: "Severe, untreated gum disease (periodontitis) is clinically linked to an increased risk of:",
            options: ["Heart disease", "Vision loss", "Asthma", "Skin cancer"],
            correctAnswer: "Heart disease",
            explanation: "Bacteria from inflamed gums can enter the bloodstream, contributing to arterial plaque buildup and cardiovascular issues."
        },
        {
            question: "What mineral is often added to public water supplies to help prevent tooth decay?",
            options: ["Calcium", "Iron", "Fluoride", "Zinc"],
            correctAnswer: "Fluoride",
            explanation: "Community water fluoridation safely and effectively strengthens tooth enamel and reduces cavities across populations."
        },
        {
            question: "Plaque buildup on teeth can harden into a tough substance called:",
            options: ["Enamel", "Tartar (Calculus)", "Dentin", "Cementum"],
            correctAnswer: "Tartar (Calculus)",
            explanation: "Once plaque hardens into tartar, it cannot be removed by brushing alone and requires professional dental cleaning."
        },
        {
            question: "Flossing daily is critical because it:",
            options: ["Whitens teeth instantly", "Removes plaque from areas a toothbrush cannot reach", "Replaces the need for mouthwash", "Strengthens jaw bones"],
            correctAnswer: "Removes plaque from areas a toothbrush cannot reach",
            explanation: "Flossing cleans between teeth and under the gumline, areas where bacteria thrive and cause cavities and gingivitis."
        },
    ],
    "sleep-hygiene": [
        {
            question: "What is the primary function of the hormone melatonin?",
            options: ["Digesting food", "Regulating sleep-wake cycles", "Building muscle", "Fighting infections"],
            correctAnswer: "Regulating sleep-wake cycles",
            explanation: "Melatonin is produced by the pineal gland in response to darkness, signaling to your body that it is time to sleep."
        },
        {
            question: "Exposure to blue light from screens before bed disrupts sleep by:",
            options: ["Increasing heart rate", "Suppressing melatonin production", "Causing dehydration", "Lowering body temperature"],
            correctAnswer: "Suppressing melatonin production",
            explanation: "Blue light mimics daylight, tricking the brain into thinking it's daytime and halting the release of sleep-inducing melatonin."
        },
        {
            question: "During which sleep stage does most vivid dreaming occur?",
            options: ["Stage 1", "Deep Sleep", "REM (Rapid Eye Movement) sleep", "Light Sleep"],
            correctAnswer: "REM (Rapid Eye Movement) sleep",
            explanation: "During REM sleep, brain activity increases significantly, breathing becomes irregular, and vivid dreams typically occur."
        },
        {
            question: "What is the recommended room temperature range for optimal sleep?",
            options: ["50-55°F (10-13°C)", "60-67°F (15-19°C)", "70-75°F (21-24°C)", "80-85°F (27-29°C)"],
            correctAnswer: "60-67°F (15-19°C)",
            explanation: "A cooler room supports the body's natural core temperature drop that occurs during the sleep cycle."
        },
        {
            question: "Chronic sleep deprivation significantly weakens which body system?",
            options: ["Skeletal system", "Digestive system", "The immune system", "Muscular system"],
            correctAnswer: "The immune system",
            explanation: "Lack of sleep reduces the production of infection-fighting antibodies and cytokines, making you more susceptible to illnesses."
        },
    ],
    "infectious-diseases": [
        {
            question: "Why is it strictly advised to complete a full course of prescribed antibiotics?",
            options: ["To save money", "To prevent antibiotic resistance", "To build muscle", "To sleep better"],
            correctAnswer: "To prevent antibiotic resistance",
            explanation: "Stopping early allows the strongest bacteria to survive and mutate, creating superbugs that are resistant to future treatments."
        },
        {
            question: "Which of the following diseases is caused by a virus and cannot be treated with antibiotics?",
            options: ["Strep throat", "Tuberculosis", "The common cold", "Urinary tract infection"],
            correctAnswer: "The common cold",
            explanation: "Antibiotics only kill bacteria. Viral infections like the common cold or flu do not respond to antibiotics."
        },
        {
            question: "What is 'herd immunity'?",
            options: ["Immunity gained from eating meat", "When a large portion of a community becomes immune to a disease", "A specific vaccine for animals", "Immunity that only lasts one year"],
            correctAnswer: "When a large portion of a community becomes immune to a disease",
            explanation: "Herd immunity protects vulnerable individuals who cannot be vaccinated by breaking the chain of transmission in the community."
        },
        {
            question: "Vaccines work by stimulating the immune system to produce:",
            options: ["Antibodies", "Red blood cells", "Platelets", "Gastric acid"],
            correctAnswer: "Antibodies",
            explanation: "Vaccines safely teach the immune system to recognize and create specific antibodies against pathogens without causing the disease."
        },
        {
            question: "Malaria and Dengue fever are primarily transmitted to humans by:",
            options: ["Contaminated water", "Mosquitoes", "Airborne droplets", "Uncooked food"],
            correctAnswer: "Mosquitoes",
            explanation: "Vector-borne diseases like Malaria and Dengue are spread through the bites of infected mosquitoes, making vector control essential."
        },
    ],
    "emergency-preparedness": [
        {
            question: "When should you call for an ambulance instead of using a telemedicine consultation?",
            options: ["For a mild fever", "For routine prescription refills", "For sudden, severe chest pain or difficulty breathing", "For a minor scrape"],
            correctAnswer: "For sudden, severe chest pain or difficulty breathing",
            explanation: "Severe chest pain, difficulty breathing, or suspected stroke require immediate physical emergency care and transport, not a virtual visit."
        },
        {
            question: "What is the most critical information to provide when calling emergency services?",
            options: ["Your medical insurance provider", "Your exact location and the nature of the emergency", "The names of your family members", "What you ate for breakfast"],
            correctAnswer: "Your exact location and the nature of the emergency",
            explanation: "Dispatchers need your exact location first so they can route an ambulance immediately, even if the call drops."
        },
        {
            question: "While waiting for an ambulance for a trauma patient, you should:",
            options: ["Offer them food and water", "Move them to a comfortable bed", "Not move them unless they are in immediate danger", "Force them to stand up"],
            correctAnswer: "Not move them unless they are in immediate danger",
            explanation: "Moving a trauma patient can worsen spinal or neck injuries. Keep them still and calm until professionals arrive."
        },
        {
            question: "If you are at a hospital, what does the 'Red Code' or triage color Red signify?",
            options: ["Non-urgent care needed", "Immediate, life-threatening emergency", "Patient is ready for discharge", "Visitor parking area"],
            correctAnswer: "Immediate, life-threatening emergency",
            explanation: "In triage, red indicates a critical, life-threatening condition requiring immediate medical intervention."
        },
        {
            question: "What should you gather while an ambulance is en route to your home?",
            options: ["A change of clothes for a week", "The patient's ID, insurance cards, and current medications list", "A snack for the ride", "All their childhood photo albums"],
            correctAnswer: "The patient's ID, insurance cards, and current medications list",
            explanation: "Having ID and a list of current medications ready saves crucial time during hospital admission and treatment planning."
        },
    ],
    "community-health": [
        {
            question: "Which of these is a common early symptom of vector-borne diseases like Dengue or Malaria?",
            options: ["High fever and severe joint/muscle pain", "Sudden hair loss", "Improved vision", "Craving for sweets"],
            correctAnswer: "High fever and severe joint/muscle pain",
            explanation: "Dengue is often called 'breakbone fever' due to the severe joint and muscle pain that accompanies the high fever."
        },
        {
            question: "What is the most effective community-level action to prevent Dengue outbreaks?",
            options: ["Drinking more water", "Eliminating stagnant water where mosquitoes breed", "Staying indoors permanently", "Planting more trees"],
            correctAnswer: "Eliminating stagnant water where mosquitoes breed",
            explanation: "Aedes mosquitoes, which transmit Dengue, breed in clean, stagnant water often found in discarded tires, pots, and open containers."
        },
        {
            question: "If you notice a cluster of food poisoning cases in your neighborhood, you should:",
            options: ["Ignore it, it's normal", "Report it to local health authorities or via a community health platform", "Start cooking for the neighborhood", "Take antibiotics preemptively"],
            correctAnswer: "Report it to local health authorities or via a community health platform",
            explanation: "Reporting unusual health clusters helps authorities identify the source (like a contaminated food vendor) and prevent further spread."
        },
        {
            question: "What is 'contact tracing' during an infectious disease outbreak?",
            options: ["Calling friends to chat", "Identifying and notifying people who have been exposed to an infected person", "Tracing a drawing of a virus", "A type of telemedicine call"],
            correctAnswer: "Identifying and notifying people who have been exposed to an infected person",
            explanation: "Contact tracing is a public health tool used to break the chain of transmission by isolating those who may have been exposed."
        },
        {
            question: "Why is it important to wash hands with soap and water rather than just using hand sanitizer when dealing with certain outbreaks?",
            options: ["Soap smells better", "Hand sanitizer does not kill certain resilient pathogens like Norovirus", "Hand sanitizer causes immediate allergies", "Soap is always faster"],
            correctAnswer: "Hand sanitizer does not kill certain resilient pathogens like Norovirus",
            explanation: "While hand sanitizers are effective against many germs, soap and water mechanically remove all types of dirt, grime, and resilient viruses."
        }
    ],
    "healthcare-schemes": [
        {
            question: "Ayushman Bharat (PM-JAY) is a government scheme primarily aimed at providing:",
            options: ["Free gym memberships", "Cashless health insurance cover up to ₹5 Lakhs per family per year", "Free dental implants for everyone", "Travel allowances for doctors"],
            correctAnswer: "Cashless health insurance cover up to ₹5 Lakhs per family per year",
            explanation: "PM-JAY is the world's largest health insurance scheme, providing ₹5 Lakhs of secondary and tertiary care hospitalization cover to vulnerable families."
        },
        {
            question: "Which document is typically mandatory to verify identity for claiming benefits under most Indian healthcare schemes?",
            options: ["Passport", "Aadhar Card", "Driving License", "Utility Bill"],
            correctAnswer: "Aadhar Card",
            explanation: "The Aadhar Card is widely used across India as the primary biometric and demographic identity proof for accessing government subsidies and health schemes."
        },
        {
            question: "What does a 'cashless' hospitalization facility mean for a patient?",
            options: ["The patient pays in physical cash only", "The hospital provides free food", "The insurance provider settles the bill directly with the hospital", "The patient pays first and gets reimbursed later"],
            correctAnswer: "The insurance provider settles the bill directly with the hospital",
            explanation: "Cashless facilities alleviate the financial burden on patients at the time of admission, as the insurer pays the empaneled hospital directly."
        },
        {
            question: "The Employees' State Insurance (ESIC) scheme targets which demographic?",
            options: ["Farmers", "Factory and establishment workers earning below a certain wage", "Government officials", "Unemployed students"],
            correctAnswer: "Factory and establishment workers earning below a certain wage",
            explanation: "ESIC is a self-financing social security and health insurance scheme designed specifically for Indian workers and their dependents."
        },
        {
            question: "In the context of patient rights, what is 'Informed Consent'?",
            options: ["A patient agreeing to treatment after being fully informed of the risks, benefits, and alternatives", "A doctor treating a patient without asking", "Signing a hospital entry log", "Agreeing to pay the bill"],
            correctAnswer: "A patient agreeing to treatment after being fully informed of the risks, benefits, and alternatives",
            explanation: "Informed consent is a fundamental patient right ensuring they understand their medical procedure and its implications before agreeing to it."
        }
    ],
};

/* ============================================================================
 * QUIZ GAME COMPONENT
 * Handles the active gameplay loop for a selected category, including timers, 
 * scoring, answer validation, and displaying educational explanations.
 * ============================================================================ */
const QuizGame = ({ questions, category, onExit, onFinish }) => {
    // Gameplay State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);

    const currentQuestion = questions[currentQuestionIndex];

    // Timer Effect: Counts down from 15 to 0. Auto-checks answer when time runs out.
    useEffect(() => {
        if (timeLeft > 0 && !isAnswerChecked) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isAnswerChecked) {
            setIsAnswerChecked(true);
        }
    }, [timeLeft, isAnswerChecked]);

    // Handler: User clicks an option (only works if answer hasn't been checked yet)
    const handleSelectAnswer = (option) => {
        if (isAnswerChecked) return;
        setSelectedAnswer(option);
    };

    // Handler: Locks in the selected answer, stops timer, and updates the score
    const handleCheckAnswer = () => {
        if (!selectedAnswer && timeLeft > 0) return;
        setIsAnswerChecked(true);
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    // Handler: Advances to the next question or finishes the quiz
    const handleNextQuestion = () => {
        if (currentQuestionIndex + 1 >= questions.length) {
            onFinish(score + (isAnswerChecked && selectedAnswer === currentQuestion?.correctAnswer ? 0 : 0));
        }
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setTimeLeft(15);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    // --- RENDER: QUIZ COMPLETE VIEW ---
    if (currentQuestionIndex >= questions.length) {
        const isPerfectScore = score === questions.length;
        return (
            <div className="text-center py-10 relative">
                {isPerfectScore && <Confetti recycle={false} numberOfPieces={500} />}
                <div className="w-20 h-20 mx-auto bg-cyan-50 rounded-full flex items-center justify-center border-4 border-cyan-100 mb-6">
                    <Trophy className="w-10 h-10 text-cyan-500" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-blue-950">Quiz Complete!</h2>
                <p className="text-xl mb-8 text-slate-600">You scored <span className="font-bold text-cyan-600">{score}</span> out of {questions.length}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onExit}
                        className="bg-cyan-600 text-white px-8 py-3.5 rounded-xl hover:bg-cyan-700 transition-colors text-[15px] font-bold shadow-md cursor-pointer"
                    >
                        Back to Categories
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER: ACTIVE QUIZ VIEW ---
    return (
        <div>
            {/* 1. Visual Progress Bar indicating quiz completion percentage */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full mb-8 overflow-hidden shadow-inner">
                <div
                    className="bg-cyan-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                />
            </div>

            {/* 2. Question Header & Timer Countdown */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[14px] font-bold text-slate-500 uppercase tracking-wider">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <div className="flex items-center gap-4">
                        <p className="text-[14px] font-bold text-cyan-600">Score: {score}</p>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[13px] transition-colors ${timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                            <Timer className="w-4 h-4" /> {timeLeft}s
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-blue-950 mt-2 leading-tight">{currentQuestion.question}</h3>
            </div>

            {/* 3. Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {currentQuestion.options.map((option, index) => {
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const isSelected = option === selectedAnswer;

                    // Dynamic styling based on whether the answer has been checked and if it is correct
                    let buttonClass = "p-5 rounded-xl border-2 text-left transition-all duration-300 text-[15px] font-semibold cursor-pointer";
                    if (isAnswerChecked) {
                        // Reveal state: Highlight correct answer, highlight wrong selection, fade others
                        if (isCorrect) {
                            buttonClass += " bg-emerald-50 border-emerald-500 text-emerald-800 shadow-md";
                        } else if (isSelected) {
                            buttonClass += " bg-red-50 border-red-500 text-red-800";
                        } else {
                            buttonClass += " border-slate-200 bg-slate-50 text-slate-400 opacity-60";
                        }
                    } else {
                        // Active state: Highlight selected option
                        if (isSelected) {
                            buttonClass += " bg-cyan-50 border-cyan-500 text-cyan-800 shadow-sm";
                        } else {
                            buttonClass += " border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300";
                        }
                    }

                    return (
                        <button key={index} onClick={() => handleSelectAnswer(option)} className={buttonClass} disabled={isAnswerChecked}>
                            <span className="flex justify-between items-center w-full">
                                {option}
                                {isAnswerChecked && (
                                    <span>
                                        {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : isSelected && <XCircle className="w-5 h-5 text-red-600" />}
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* 4. Educational Explanation Box (Shown only after answer is locked/checked) */}
            {isAnswerChecked && (
                <div className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="text-[15px] font-bold text-blue-900">
                            {selectedAnswer === currentQuestion.correctAnswer ? "🎉 Excellent!" : timeLeft === 0 ? "⏰ Time's Up!" : "❌ Not quite."}
                        </div>
                    </div>
                    <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                        <span className="font-bold text-blue-800">Did you know?</span> {currentQuestion.explanation}
                    </p>
                </div>
            )}

            {/* 5. Footer Controls (Check Answer / Next Question) */}
            <div className="flex justify-end items-center border-t-2 border-slate-100 pt-6">
                {isAnswerChecked ? (
                    <button onClick={handleNextQuestion} className="bg-cyan-600 text-white px-8 py-3.5 rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2 text-[15px] font-bold shadow-md cursor-pointer">
                        {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"} <ArrowRight className="w-5 h-5" />
                    </button>
                ) : (
                    <button onClick={handleCheckAnswer} disabled={!selectedAnswer && timeLeft > 0} className="bg-blue-950 text-white px-8 py-3.5 rounded-xl hover:bg-blue-800 transition-colors flex items-center gap-2 text-[15px] font-bold shadow-md disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer">
                        Check Answer
                    </button>
                )}
            </div>
        </div>
    );
};

/* ============================================================================
 * MAIN GAMIFIED MODULE COMPONENT
 * Orchestrates category selection, persistent high scores, and acts as the 
 * parent wrapper for the QuizGame component.
 * ============================================================================ */
export default function Gamified() {
    // Application State
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeQuestions, setActiveQuestions] = useState([]);
    const [questionCount, setQuestionCount] = useState(5);
    
    // Load high scores from localStorage (persistent state)
    const [highScores, setHighScores] = useState(() => {
        try {
            const saved = localStorage.getItem('healthQuizHighScores');
            return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
    });

    const navigate = useNavigate();

    const formatCategoryName = (key) => {
        if (key === 'wcd') return 'Women & Child Health';
        return key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const handleCategorySelect = (category) => {
        // Randomize questions and pick based on user selection
        const categoryQuestions = quizData[category];
        const actualCount = questionCount === 'All' ? categoryQuestions.length : Math.min(questionCount, categoryQuestions.length);
        const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5).slice(0, actualCount);
        // Randomize options
        const prepared = shuffled.map(q => ({ ...q, options: [...q.options].sort(() => Math.random() - 0.5) }));
        setActiveQuestions(prepared);
        setSelectedCategory(category);
    };

    const handleQuizFinish = (score) => {
        const currentHigh = highScores[selectedCategory] || 0;
        if (score > currentHigh) {
            const newScores = { ...highScores, [selectedCategory]: score };
            setHighScores(newScores);
            localStorage.setItem('healthQuizHighScores', JSON.stringify(newScores));
        }
    };

    return (
        <div className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-blue-950 bg-slate-50 border-t-2 pt-24 pb-16 px-4 md:px-10 lg:px-10">
            {/* --- TOP NAVIGATION BAR --- */}
            <div className="fixed top-0 left-0 right-0 z-40 px-4 h-18 flex items-center justify-between transition-all duration-300 bg-blue-100/85 backdrop-blur-sm shadow-[0_10px_16px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
                <div className="w-full flex justify-between items-center">
                    <button onClick={() => navigate('/')} className="flex items-center text-slate-600 text-[16px] font-semibold hover:text-cyan-700 tracking-widest transition-colors py-4 cursor-pointer">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto mt-8">
                {/* --- HEADER SECTION --- */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-cyan-200">
                        <Trophy className="w-8 h-8 text-cyan-600" />
                    </div>
                    <h1 className="font-poppins text-3xl md:text-4xl font-bold text-blue-950 tracking-widest mb-3">
                        Health & Wellness <span className="text-blue-900">Quiz</span>
                    </h1>
                    <p className="text-slate-600 text-[18px] leading-relaxed max-w-2xl mx-auto">
                        Challenge your knowledge on various health topics and learn practical tips along the way.
                    </p>
                </div>

                {/* --- MAIN CONTENT (Conditional Rendering) --- */}
                {!selectedCategory ? (
                    <>
                        {/* View: Category Selection */}
                        {/* Configuration Dropdown for Number of Questions */}
                        <div className="flex justify-center items-center gap-3 mb-8">
                            <label className="text-[14px] font-bold text-slate-500 uppercase tracking-wider">Select Question Count:</label>
                            <select
                                value={questionCount}
                                onChange={(e) => setQuestionCount(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                                className="bg-white border-2 border-slate-200 text-blue-950 font-bold text-[14px] rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-sm cursor-pointer transition-all"
                            >
                                <option value={5}>5 Questions</option>
                                <option value="All">All Questions</option>
                            </select>
                        </div>
                        
                        {/* Category Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.keys(quizData).map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategorySelect(category)}
                                className="relative bg-white border-sky-700 border-2 rounded-3xl p-8 shadow-xl hover:-translate-y-1 hover:border-blue-800 hover:shadow-[0_20px_40px_rgb(6,182,212,0.06)] transition-all duration-300 text-left flex flex-col group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-cyan-100 transition-colors">
                                    <PlayCircle className="w-6 h-6 text-blue-600 group-hover:text-cyan-700" />
                                </div>
                                <h3 className="font-poppins text-[20px] font-bold text-blue-950 mb-2 group-hover:text-cyan-700 transition-colors">
                                    {formatCategoryName(category)}
                                </h3>
                                <p className="text-slate-500 text-[14px] font-medium mt-auto">
                                    {quizData[category].length} Questions Available
                                </p>
                                {/* Persistent High Score Display Badge */}
                                {highScores[category] !== undefined && (
                                    <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 shadow-sm flex items-center gap-1 uppercase tracking-wider">
                                        <Trophy className="w-3 h-3" /> High Score: {highScores[category]}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    </>
                ) : (
                    <div className="bg-white border-sky-700 border-2 rounded-3xl p-8 shadow-xl max-w-3xl mx-auto animate-fade-in">
                        {/* View: Active Quiz Play */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-100">
                            <button onClick={() => setSelectedCategory(null)} className="flex items-center text-[14px] font-bold text-slate-500 hover:text-cyan-700 transition-colors cursor-pointer">
                                <ArrowLeft className="w-4 h-4 mr-1.5" /> All Categories
                            </button>
                            <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-lg text-[12px] font-bold border border-blue-100 uppercase tracking-widest">
                                {formatCategoryName(selectedCategory)}
                            </span>
                        </div>
                        <QuizGame questions={activeQuestions} category={selectedCategory} onExit={() => setSelectedCategory(null)} onFinish={handleQuizFinish} />
                    </div>
                )}
            </div>
        </div>
    );
}
