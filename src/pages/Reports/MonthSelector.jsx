import React from "react";

const MonthSelector = ({ filterMonth, setFilterMonth }) => {
    const generateMonthYearOptions = (numMonths = 12) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const options = [];
        const currentDate = new Date();

        for (let i = 0; i < numMonths; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthName = months[date.getMonth()];
            const year = date.getFullYear();
            options.push(`${monthName} ${year}`);
        }

        return options;
    };

    const monthYearOptions = generateMonthYearOptions(12);

    return (

        <select
            className="report-filter-select"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}

        >
            <option value="">All Months</option>
            {monthYearOptions.map((label) => (
                <option key={label} value={label}>
                    {label}
                </option>
            ))}
        </select>
    );
};

export default MonthSelector;
