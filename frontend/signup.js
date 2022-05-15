const submitSignupSocial = async () => {
  const nickname = document.querySelector('#SignupNickname').value;
  await axios.post(
    'http://localhost:3000/user/social',
    {
      createUserSocialDto: { nickname },
    },
    { withCredentials: true },
  );
};
