// SIDEBAR TOGGLE

let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

// ---------- CHARTS ----------

// BAR CHART
const barChartOptions = {
  series: [
    {
      data: [30, 14, 20, 4, 2],
    },
  ],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false,
    },
  },
  colors: ['#ccd5ae', '#e9edc9', '#fcefb4', '#faedcd', '#d4a373'],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 4,
      horizontal: false,
      columnWidth: '40%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: ['Curtain', 'Shutter', 'Frame', 'Accessories', 'Others'],
  },
  yaxis: {
    title: {
      text: 'Count',
    },
  },
};

const barChart = new ApexCharts(
  document.querySelector('#bar-chart'),
  barChartOptions
);
barChart.render();






// AREA CHART
const areaChartOptions = {
  series: [
    {
      name: 'Purchase Orders',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: 'Sales Orders',
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ],
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: ['#a5a58d', '#cb997e'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  markers: {
    size: 0,
  },
  yaxis: [
    {
      title: {
        text: 'Purchase Orders',
      },
    },
    {
      opposite: true,
      title: {
        text: 'Sales Orders',
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
  },
};

const areaChart = new ApexCharts(
  document.querySelector('#area-chart'),
  areaChartOptions
);
areaChart.render();


// PIE CHART
const pieChartOptions = {
  series: [12, 9, 6, 3],
  chart: {
      type: 'pie',
      height: 350,
      toolbar: {
          show: true
      }
  },
  labels: ['Taking measurements', 'Installing a new product', 'Repairing an existing product', 'Laundries'], 
  colors: ['#95b8d1', '#a5a58d', '#faedcd', '#ddbea9'],
  legend: {
      position: 'bottom'
  },
  responsive: [{
      breakpoint: 480,
      options: {
          chart: {
              width: 200
          },
          legend: {
              position: 'bottom'
          }
      }
  }]
};

const pieChart = new ApexCharts(
  document.querySelector("#pie-chart"), 
  pieChartOptions
);
pieChart.render();

// SPEEDOMETER CHART




// TODOLIST
document.getElementById('new-task').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
      addTask();
  }
});

function addTask() {
  const taskInput = document.getElementById('new-task');
  const newTask = taskInput.value.trim();
  if (newTask) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<input type="checkbox" onclick="toggleTaskCompleted(this)"> ${newTask}`;
      document.getElementById('todo-items').appendChild(listItem);
      taskInput.value = '';  // Clear input after adding
  }
}

function toggleTaskCompleted(checkbox) {
  if (checkbox.checked) {
      checkbox.parentNode.style.textDecoration = 'line-through';
  } else {
      checkbox.parentNode.style.textDecoration = 'none';
  }
}



// CALENDAR
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [
          {
              title: 'Meeting',
              start: new Date().toISOString().split('T')[0],
              allDay: true
          },
          {
              title: 'Conference',
              start: '2024-01-28',
              end: '2024-01-29'
          }
      ]
  });
  calendar.render();
});
