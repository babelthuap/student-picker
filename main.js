// equivalent to jQuery(document).ready(fn);
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function(){
  var students = [];

  var inputForm = document.getElementById('newStudentName');
  inputForm.addEventListener('keypress', keyPressed);
  inputForm.focus();

  function keyPressed(event) {
    // on 'enter' press
    if (event.charCode === 13) {
      addStudent();
    }
  }

  document.getElementById('addButton').addEventListener('click', addStudent);

  function addStudent() {
    var studentNames = inputForm.value.split(/\s*,\s*/);

    studentNames.forEach(function(name) {
      // don't allow duplicate students
      if (name.length !== 0  &&  students.indexOf(name) === -1) {
        students.push( name );

        inputForm.value = '';
        inputForm.focus();

        document.getElementById('teamSize').value = '1';
        printStudentList(students);
      } else {
        console.log("'" + name + "' already exists in the list.");
      }
    });
  }

  function isPrime(n) {
    if (n < 2) {
      return false;
    }
    var sqrt_n = Math.sqrt(n);
    for (var i = 2; i <= sqrt_n; i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  var studentList = document.getElementById('studentList');

  // update the current list of students
  function printStudentList(array, isInTeams) {
    document.getElementById('numStudents').innerHTML = students.length;
    var primeSpan = document.getElementById('prime');
    primeSpan.innerHTML = '';
    if (isPrime(students.length)) {
      primeSpan.innerHTML = ' (which is prime)';
    }

    studentList.innerHTML = '';
    var newList = document.createElement('div');

    array.forEach(function( studentName, index ){
      var name = document.createElement('a');
      name.setAttribute("id", index);
      name.setAttribute("href", "#");
      name.innerHTML = studentName;
      if (!isInTeams) {
        name.addEventListener('click', deleteStudent);
      }
      newList.appendChild( name );
    });

    studentList.appendChild( newList );
  }

  // delete student name when clicked
  function deleteStudent(student) {
    var studentIndex = student.toElement.id;
    inputForm.value = students.splice(studentIndex, 1);
    printStudentList(students);
  }

  // return random integer in [a,b]
  function rand(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  document.getElementById('get1').addEventListener('click', getRandStudent);

  var randomStudent = document.getElementById('randomStudent');
  function getRandStudent() {
    if (students.length > 0) {
      randomStudent.innerHTML = ' - ' + students[ rand(0, students.length - 1) ];
    }
  }

  // shuffle student list with Fisher-Yates algorithm
  document.getElementById('shuffle').addEventListener('click', function(){
    students = shuffle(students);
    splitIntoTeams();
  });

  function shuffle(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
      var temp = arr[i];
      var iOther = rand(0, i);
      arr[i] = arr[iOther];
      arr[iOther] = temp;
    }
    return arr;
  }

  // split into teams
  var teamSizeInput = document.getElementById('teamSize');
  teamSizeInput.addEventListener('change', splitIntoTeams);

  function splitIntoTeams() {
    var teamSize = teamSizeInput.value;

    if (teamSize == 1) {
      printStudentList(students, false);
    } else {
      var teams = [];

      students.forEach(function(student, index) {
        if (index % teamSize === 0) {
          teams.push( '<strong>team ' + (teams.length + 1) + ':</strong> ' + student );
        } else {
          teams[teams.length - 1] += ', ' + student;
        }
      });

      try {
        // notify user if the last team is smaller than the rest
        var lastTeamCommas = teams[teams.length - 1].match(/,/g);
        var lastTeamSize = lastTeamCommas ? lastTeamCommas.length + 1 : 1;
        if (lastTeamSize < teamSize) {
          teams[teams.length - 1] += ' <em>(only ' + lastTeamSize +
            ' student' + (lastTeamSize > 1 ? 's' : '') + ')</em>';
        }
      } catch (e) {
        console.log(e);
      }

      printStudentList(teams, true);
    }
  }

  // sort student list
  document.getElementById('sort').addEventListener('click', function(){
    students.sort();
    teamSizeInput.value = '1';
    printStudentList(students);
  });
});
