import React from 'react';
import { TagsInput } from 'react-tag-input-component';

const TagInputResume = (props) => {
  const { setSelectedTags, selectedTags, questionId, questionDetail } = props;

  const handleCheck = (tags) => {
    // If selectedTags has a length greater than zero
    if (selectedTags.length > 0) {
      // Find if selectedTags contains the questionDetail.id
      const existingTags = selectedTags.find(item => item.id === questionDetail.id);

      if (existingTags) {
        // If questionDetail.id exists, update its tags
        const updatedTags = selectedTags.map(item => 
          item.id === questionDetail.id 
            ? { ...item, tags } // Update tags array for matching id
            : item
        );
        setSelectedTags(updatedTags);
      } else {
        // If questionDetail.id doesn't exist, add a new entry with the id and tags
        setSelectedTags([...selectedTags, { id: questionDetail.id, tags }]);
      }
    } else {
      // If no tags exist, add the first one
      setSelectedTags([{ id: questionDetail.id, tags }]);
    }
  };


  return (
    <div className="tags-input-resume-holder">
      <TagsInput
        value={selectedTags.find(item => item.id === questionId)?.tags || []}
        onChange={handleCheck}
        name="tags"
        placeHolder="Enter tags"
      />
    </div>
  );
};

export default TagInputResume;
