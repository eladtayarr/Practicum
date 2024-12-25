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
      data: [10, 8, 6, 4, 2],
    },
  ],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false,
    },
  },
  colors: ['#246dec', '#cc3c43', '#367952', '#f5b74f', '#4f35a1'],
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
    categories: ['Laptop', 'Phone', 'Monitor', 'Headphones', 'Camera'],
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
  colors: ['#4f35a1', '#246dec'],
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
  series: [12, 9, 6, 3, 1],
  chart: {
      type: 'pie',
      height: 350,
      toolbar: {
          show: true
      }
  },
  labels: ['Laptop', 'Phone', 'Monitor', 'Headphones', 'Camera'],
  colors: ['#007bff', '#dc3545', '#28a745', '#ffc107', '#6f42c1'],
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
const speedometerChartOptions = {
    series: [76], // Example value to display
    chart: {
        type: 'radialBar',
        height: 300
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
                margin: 10,
                size: '50%',
                background: 'transparent',
            },
            dataLabels: {
                name: {
                    show: false,
                },
                value: {
                    offsetY: 10,
                    fontSize: '22px',
                    color: 'black',
                    formatter: function (val) {
                        return val + "%";
                    }
                }
            },
            track: {
                background: '#e0e0e0',
                strokeWidth: '97%',
                margin: 5, // margin is in pixels
            },
        }
    },
    colors: ['#20E647'],
    stroke: {
        lineCap: 'round'
    },
    labels: ['Progress']
};

const speedometerChart = new ApexCharts(document.querySelector("#speedometer-chart"), speedometerChartOptions);
speedometerChart.render();




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
