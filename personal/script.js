const submitButton = document.getElementById("submitButton");
const strengthResult = document.getElementById("strengthResult");

submitButton.addEventListener("click", function() {
  const password = document.getElementById("passwordInput").value;

  // Error handling (optional)
  if (password.length === 0) {
    alert("Please enter a password to check its strength.");
    return;
  }

  const score = testPasswordStrength(password);
  console.log("Password Score:", score); // For debugging

  let message = "";

  if (score === 4) {
    message = "Strong password! Keep it safe and don't share it with anyone.";
  } else if (score === 3) {
    message = "Medium strength password. Consider adding more complexity (uppercase, lowercase, numbers, symbols).";
  } else if (score === 2) {
    message = "Weak password! Consider using a stronger one with more characters and variety.";
  } else {
    message = "Password is not secure at all.";
  }

  strengthResult.innerHTML = "Congratulations, your password has been checked! Here are the results: " + message;
});

function testPasswordStrength(password) {
  let hasLength = password.length >= 12 && password.length <= 14;
  let hasUppercase = /[A-Z]/.test(password);
  let hasLowercase = /[a-z]/.test(password);
  let hasNumbers = /\d/.test(password);
  let hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  let strength = 0;

  if (hasLength) strength++;
  if (hasUppercase) strength++;
  if (hasLowercase) strength++;
  if (hasNumbers) strength++;
  if (hasSpecialChars) strength++;

  return strength;
}
