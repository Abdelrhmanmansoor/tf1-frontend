'use client';

import React, { useState } from 'react';
import { CVData } from '@/types/cv';

interface CVEditorProps {
  cv: CVData;
  onChange: (cv: CVData) => void;
}

export default function CVEditor({ cv, onChange }: CVEditorProps) {
  const handlePersonalInfoChange = (field: string, value: string) => {
    onChange({
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        [field]: value,
      },
    });
  };

  const handleAddExperience = () => {
    onChange({
      ...cv,
      experience: [
        ...cv.experience,
        {
          id: Date.now().toString(),
          jobTitle: '',
          company: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false,
          description: '',
        },
      ],
    });
  };

  const handleUpdateExperience = (index: number, field: string, value: any) => {
    const updated = [...cv.experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...cv, experience: updated });
  };

  const handleRemoveExperience = (index: number) => {
    onChange({
      ...cv,
      experience: cv.experience.filter((_, i) => i !== index),
    });
  };

  const handleAddEducation = () => {
    onChange({
      ...cv,
      education: [
        ...cv.education,
        {
          id: Date.now().toString(),
          school: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          grade: '',
        },
      ],
    });
  };

  const handleUpdateEducation = (index: number, field: string, value: any) => {
    const updated = [...cv.education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...cv, education: updated });
  };

  const handleRemoveEducation = (index: number) => {
    onChange({
      ...cv,
      education: cv.education.filter((_, i) => i !== index),
    });
  };

  const handleAddSkill = () => {
    onChange({
      ...cv,
      skills: [
        ...cv.skills,
        {
          id: Date.now().toString(),
          name: '',
          level: 'intermediate',
        },
      ],
    });
  };

  const handleUpdateSkill = (index: number, field: string, value: any) => {
    const updated = [...cv.skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...cv, skills: updated });
  };

  const handleRemoveSkill = (index: number) => {
    onChange({
      ...cv,
      skills: cv.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="cv-editor">
      {/* Personal Information Section */}
      <section className="editor-section">
        <h2>Personal Information</h2>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={cv.personalInfo.fullName}
            onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={cv.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={cv.personalInfo.phone || ''}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={cv.personalInfo.location || ''}
            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            placeholder="City, Country"
          />
        </div>
        <div className="form-group">
          <label>Professional Summary</label>
          <textarea
            value={cv.personalInfo.summary || ''}
            onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
            placeholder="Brief professional summary"
            rows={4}
          />
        </div>
      </section>

      {/* Experience Section */}
      <section className="editor-section">
        <h2>Work Experience</h2>
        {cv.experience.map((exp, index) => (
          <div key={exp.id} className="subsection">
            <div className="subsection-header">
              <h3>{exp.jobTitle || 'Job Title'}</h3>
              <button
                className="btn-remove"
                onClick={() => handleRemoveExperience(index)}
              >
                ✕
              </button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={exp.jobTitle}
                  onChange={(e) => handleUpdateExperience(index, 'jobTitle', e.target.value)}
                  placeholder="Job title"
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                  placeholder="Company name"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)}
                  disabled={exp.currentlyWorking}
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) =>
                      handleUpdateExperience(index, 'currentlyWorking', e.target.checked)
                    }
                  />
                  Currently Working
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                placeholder="Job description and achievements"
                rows={3}
              />
            </div>
          </div>
        ))}
        <button className="btn btn-secondary" onClick={handleAddExperience}>
          + Add Experience
        </button>
      </section>

      {/* Education Section */}
      <section className="editor-section">
        <h2>Education</h2>
        {cv.education.map((edu, index) => (
          <div key={edu.id} className="subsection">
            <div className="subsection-header">
              <h3>{edu.school || 'School'}</h3>
              <button
                className="btn-remove"
                onClick={() => handleRemoveEducation(index)}
              >
                ✕
              </button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>School/University</label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => handleUpdateEducation(index, 'school', e.target.value)}
                  placeholder="School name"
                />
              </div>
              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Field of Study</label>
                <input
                  type="text"
                  value={edu.fieldOfStudy}
                  onChange={(e) =>
                    handleUpdateEducation(index, 'fieldOfStudy', e.target.value)
                  }
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="form-group">
                <label>Grade/GPA</label>
                <input
                  type="text"
                  value={edu.grade || ''}
                  onChange={(e) => handleUpdateEducation(index, 'grade', e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => handleUpdateEducation(index, 'startDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => handleUpdateEducation(index, 'endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <button className="btn btn-secondary" onClick={handleAddEducation}>
          + Add Education
        </button>
      </section>

      {/* Skills Section */}
      <section className="editor-section">
        <h2>Skills</h2>
        <div className="skills-grid">
          {cv.skills.map((skill, index) => (
            <div key={skill.id} className="skill-item">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleUpdateSkill(index, 'name', e.target.value)}
                placeholder="Skill name"
              />
              <select
                value={skill.level}
                onChange={(e) => handleUpdateSkill(index, 'level', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <button
                className="btn-remove"
                onClick={() => handleRemoveSkill(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={handleAddSkill}>
          + Add Skill
        </button>
      </section>
    </div>
  );
}
