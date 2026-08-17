import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import PersonForm from './PersonForm';

const PAGE_SIZE = 10;

function Dashboard({ session, onLogout }) {
  const [people, setPeople] = useState([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const admin = session.role === 'ADMIN';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/persons');
      setPeople(response.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() =>
      people.filter((person) =>
          `${person.firstName} ${person.lastName} ${person.email}`
              .toLowerCase()
              .includes(query.toLowerCase())
      ), [people, query]
  );

  // Reset to page 1 whenever the search results change so the user
  // doesn't land on an empty page after a new search.
  useEffect(() => {
    setPage(1);
  }, [query, people]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Keep the current page in range if the list shrinks (e.g. after a delete).
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const save = async (person) => {
    try {
      const path = editing?.id ? `/persons/${editing.id}` : '/persons';
      const method = editing?.id ? 'put' : 'post';
      await api[method](path, person);
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (person) => {
    if (!window.confirm(`Delete ${person.firstName} ${person.lastName}?`)) return;
    try {
      await api.delete(`/persons/${person.id}`);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <main className="app-shell">
        <header className="topbar">
          <div className="top-brand">
            <div className="brand-mark small">P</div>
            <span>People<span className="brand-muted">/directory</span></span>
          </div>
          <div className="profile">
            <div className="avatar">{session.username.slice(0, 1).toUpperCase()}</div>
            <div><strong>{session.username}</strong><small>{session.role}</small></div>
            <button className="logout" onClick={onLogout}>Sign out</button>
          </div>
        </header>
        <section className="content">
          <div className="page-intro">
            <div>
              <p className="eyebrow">DIRECTORY</p>
              <h1>People</h1>
              <p className="muted">A clear view of everyone in your organization.</p>
            </div>
            {admin && <button className="primary add-button" onClick={() => setEditing({})}>+ Add person</button>}
          </div>
          <div className="toolbar">
            <div className="search">
              <span>⌕</span>
              <input
                  placeholder="Search by name or email"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <span className="count">{filtered.length} {filtered.length === 1 ? 'person' : 'people'}</span>
          </div>
          {error && (
              <div className="error banner">
                {error}
                <button onClick={load}>Retry</button>
              </div>
          )}
          <div className="table-wrap">
            <table>
              <thead>
              <tr>
                <th>Person</th>
                <th>Email</th>
                <th>Record ID</th>
                {admin && <th aria-label="Actions" />}
              </tr>
              </thead>
              <tbody>
              {loading ? (
                  <tr>
                    <td colSpan={admin ? 4 : 3} className="empty">Loading directory…</td>
                  </tr>
              ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={admin ? 4 : 3} className="empty">No people match your search.</td>
                  </tr>
              ) : (
                  paginated.map((person) => (
                      <tr key={person.id}>
                        <td>
                          <div className="person-cell">
                            <div className="person-avatar">{person.firstName[0]}{person.lastName[0]}</div>
                            <strong>{person.firstName} {person.lastName}</strong>
                          </div>
                        </td>
                        <td>{person.email}</td>
                        <td className="id">#{person.id}</td>
                        {admin && (
                            <td className="actions">
                              <button onClick={() => setEditing(person)}>Edit</button>
                              <button className="danger" onClick={() => remove(person)}>Delete</button>
                            </td>
                        )}
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length > 0 && (
              <div className="pagination">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                  ← Prev
                </button>
                <span className="pagination-status">
              Page {page} of {totalPages}
            </span>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
          )}
        </section>
        {editing && (
            <div className="modal-backdrop">
              <div className="modal">
                <PersonForm
                    person={editing.id ? editing : null}
                    onSave={save}
                    onCancel={() => setEditing(null)}
                />
              </div>
            </div>
        )}
      </main>
  );
}

export default Dashboard;