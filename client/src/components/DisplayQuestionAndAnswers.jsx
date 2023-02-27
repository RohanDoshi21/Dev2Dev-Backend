import React from "react";

const DisplayQuestionAndAnswers = ({ question }) => {
    return (
        <div className="flex flex-col mx-auto w-2/3">
            <div className="justify-start content-start items-start">
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <div className="text-2xl font-bold">
                                    {question.title}
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="text-sm text-gray-500">
                                    {question.description}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <div className="text-sm text-gray-500">
                                    {question.answers.length} Answers
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="text-sm text-gray-500">
                                    {question.views} Views
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                            <div className="text-sm text-gray-500">
                                Asked {question.createdAt}
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="text-sm text-gray-500">
                                {question.tags.map((tag) => (
                                    <div className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}