import { useNavigate } from "react-router-dom";

export default function HealthTools() {

  const navigate = useNavigate();

  const tools = [
    {
      title: "BMI Calculator",
      description: "Check your body mass index.",
      route: "/bmi",
      color: "bg-green-500"
    },
    {
      title: "Lung Strength Test",
      description: "Breathing strength test.",
      route: "/lungs",
      color: "bg-blue-500"
    },
    {
      title: "Eye Strain Test",
      description: "Digital eye fatigue test.",
      route: "/eye",
      color: "bg-orange-400"
    },
    {
      title: "Reaction Time",
      description: "Check reflex speed.",
      route: "/reaction",
      color: "bg-purple-500"
    },
    {
      title: "Hydration Check",
      description: "Water intake calculator.",
      route: "/hydration",
      color: "bg-cyan-500"
    },
    {
      title: "Stress Quiz",
      description: "Mental stress level check.",
      route: "/stress",
      color: "bg-pink-400"
    }
  ];

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        MediConnect
      </h1>

      <h2 className="text-xl mb-6 text-gray-600">
        Quick Health Tests
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {tools.map((tool,index)=>(

          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer"
            onClick={()=>navigate(tool.route)}
          >

            <div className={`${tool.color} text-white p-6 rounded-t-xl`}>
              <h3 className="text-xl font-semibold">{tool.title}</h3>
            </div>

            <div className="p-6">

              <p className="text-gray-500 mb-4">
                {tool.description}
              </p>

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Start Test
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}