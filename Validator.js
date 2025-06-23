function Validator(option) {
  const formElement = document.getElementById(option.form);
  const selectorRules = {}; // Lưu nhiều rules cho mỗi selector

  if (formElement) {
    option.rules.forEach(function (rule) {
      // Nếu selector đã tồn tại, thêm vào mảng
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      const inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        inputElement.onblur = function () {
          let errorMessage;
          const rules = selectorRules[rule.selector];
          for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
          }

          const errorElement = inputElement.nextElementSibling;
          if (errorMessage) {
            inputElement.classList.add("invalid");
            if (errorElement) errorElement.innerText = errorMessage;
          } else {
            inputElement.classList.remove("invalid");
            if (errorElement) errorElement.innerText = "";
          }
        };
      }
    });
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Please enter this field";
    },
  };
};

Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value) ? undefined : "Please enter a valid email";
    },
  };
};

Validator.minLength = function (selector, minLength, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= minLength
        ? undefined
        : message || `Please enter at least ${minLength} characters`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Values do not match";
    },
  };
};
