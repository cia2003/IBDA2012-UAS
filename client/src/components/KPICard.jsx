function KPICard({title, value}) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 bg-red-100 rounded-lg`}>Icon</div>
              <span className={`text-blue-600 text-sm font-semibold`}>Change</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
    )
}

export default KPICard
