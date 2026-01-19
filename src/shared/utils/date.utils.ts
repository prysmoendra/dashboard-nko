export const getWeekNumber = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // Construct start of month
    const startOfMonth = new Date(year, month, 1);
    const startDayOfWeek = startOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

    // Find the end of Week 1 (First Sunday of the month)
    // If startDayOfWeek is 0 (Sun), the first Sunday is the 1st.
    // Otherwise, it's (1 + (7 - startDayOfWeek)).
    // Example: Jan 2026 starts Thu (4). 1 + (7-4) = 4. Jan 4th is Sunday.
    const firstSundayDate = startDayOfWeek === 0 ? 1 : 1 + (7 - startDayOfWeek);

    if (day <= firstSundayDate) {
        return 1;
    }

    // Subsequent weeks
    const daysAfterWeek1 = day - firstSundayDate;
    const subsequentWeeks = Math.ceil(daysAfterWeek1 / 7);

    // Cap at Week 5 to align with database constraints and business logic
    // (Some months spanning 6 weeks will have the last days merged into Week 5)
    return Math.min(1 + subsequentWeeks, 5);
};

export const isWeekInFuture = (selectedWeek: number, selectedMonth: number, selectedYear: number): boolean => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // Calculate current week
    const currentWeek = getWeekNumber(today);

    if (selectedYear > currentYear) return true;
    if (selectedYear < currentYear) return false;

    // Same year
    if (selectedMonth > currentMonth) return true;
    if (selectedMonth < currentMonth) return false;

    // Same month
    return selectedWeek > currentWeek;
};
