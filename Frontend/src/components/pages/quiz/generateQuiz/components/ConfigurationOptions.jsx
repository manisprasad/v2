import DropdownSelector from "./DropdownSelector";

const ConfigurationOptions = ({
  difficulty,
  questionCount,
  questionType,
  difficultyLevels,
  questionCounts,
  questionTypes,
  onDifficultySelect,
  onQuestionCountSelect,
  onQuestionTypeSelect,
  languageOptions,
  onLanguageSelect,
  language
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Difficulty Selector */}
      <DropdownSelector
        label="Difficulty Level"
        options={difficultyLevels}
        selectedOption={difficulty}
        onSelect={onDifficultySelect}
        placeholder="Select difficulty..."
      />

      {/* Question Count Selector */}
      <DropdownSelector
        label="Number of Questions"
        options={questionCounts}
        selectedOption={questionCount}
        onSelect={onQuestionCountSelect}
        placeholder="Select question count..."
      />

      {/* Question Type Selector */}
      <DropdownSelector
        label="Type of Question"
        options={questionTypes}
        selectedOption={questionType}
        onSelect={onQuestionTypeSelect}
        placeholder="Select question type..."
      />
      <DropdownSelector
        label="Language"
        options={languageOptions}
        selectedOption={language}
        onSelect={onLanguageSelect}
        placeholder="Select language..."
      />
        {/* <DropdownSelector
        label="Language"
        options={languageOptions}
        selectedOption={language}
        onSelect={onLanguageSelect}
        placeholder="Select language..."
      /> */}
    </div>
  );
};

export default ConfigurationOptions;
