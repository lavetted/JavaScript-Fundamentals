const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, ag, submissions) {
  try {
    // if / else requirement
    if (ag.course_id === course.id) {
      // valid
    } else {
      throw new Error("AssignmentGroup does not belong to this course.");
    }

    const now = new Date();
    const assignmentMap = {};

    // loop type #1 (for...of)
    for (const assign of ag.assignments) {
      const dueDate = new Date(assign.due_at);

      if (dueDate > now) continue; // continue requirement

      if (
        typeof assign.points_possible !== "number" ||
        assign.points_possible <= 0
      ) {
        throw new Error(`Invalid points_possible for assignment ${assign.id}`);
      }

      assignmentMap[assign.id] = assign;
    }

    const learners = {};

    // loop type #2 (for...of)
    for (const sub of submissions) {
      const assignment = assignmentMap[sub.assignment_id];
      if (!assignment) continue;

      if (typeof sub.submission.score !== "number") {
        throw new Error(`Invalid score for assignment ${sub.assignment_id}`);
      }

      if (!learners[sub.learner_id]) {
        learners[sub.learner_id] = {
          id: sub.learner_id,
          _earned: 0,
          _possible: 0,
        };
      }

      const submitted = new Date(sub.submission.submitted_at);
      const due = new Date(assignment.due_at);

      let score = sub.submission.score;

      if (submitted > due) {
        score -= assignment.points_possible * 0.1;
      } else {
        score = score;
      }

      if (score < 0) score = 0;

      learners[sub.learner_id][assignment.id] = Number(
        (score / assignment.points_possible).toFixed(3)
      );

      learners[sub.learner_id]._earned += score;
      learners[sub.learner_id]._possible += assignment.points_possible;
    }

    // format output + removal requirement
    return Object.values(learners).map((learner) => {
      if (learner._possible > 0) {
        learner.avg = Number((learner._earned / learner._possible).toFixed(3));
      } else {
        learner.avg = 0;
      }

      delete learner._earned; // removal requirement
      delete learner._possible; // removal requirement

      return learner;
    });
  } catch (error) {
    console.error("Error:", error.message);
    return [];
  }
}

console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));

// // here, we would process this data to achieve the desired result.
//   const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0 // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833 // late: (140 - 15) / 150
//     }
//   ];
