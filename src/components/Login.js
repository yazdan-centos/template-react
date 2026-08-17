import { useForm } from 'react-hook-form';
import api from '../services/api';

function Login({ onLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      onLogin(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="brand-mark">P</div>
        <p className="eyebrow">PERSON DIRECTORY</p>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your organization’s people.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Username
            <input autoFocus {...register('username', { required: true })} />
          </label>
          {errors.username && <div className="error">Username is required</div>}
          <label>
            Password
            <input type="password" {...register('password', { required: true })} />
          </label>
          {errors.password && <div className="error">Password is required</div>}
          <button className="primary" type="submit">Sign in <span>→</span></button>
        </form>
      </section>
    </main>
  );
}

export default Login;
