export const markAttendance = async (qrToken, token) => {
    const res = await fetch('/api/attendance/mark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ qrToken }),
    });
    return res.json();
  };
  