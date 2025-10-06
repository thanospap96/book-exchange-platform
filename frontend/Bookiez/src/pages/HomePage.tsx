import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, MessageSquare, ArrowRight } from "lucide-react";

const HomePage = () => {
  useEffect(() => {
    document.title = "Bookiez - Book Exchange Platform";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-cf-dark-red">Bookiez</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with fellow book lovers, exchange your favorite reads, and discover new worlds through the magic of sharing books.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/books"
              className="bg-cf-dark-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              Browse Books
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="border-2 border-cf-dark-red text-cf-dark-red px-8 py-3 rounded-lg font-semibold hover:bg-cf-dark-red hover:text-white transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Bookiez?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <BookOpen className="w-12 h-12 text-cf-dark-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Share Your Books</h3>
              <p className="text-gray-600">
                List your books and let others discover the stories that moved you.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <Users className="w-12 h-12 text-cf-dark-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Find Your Match</h3>
              <p className="text-gray-600">
                Connect with readers who have books you want and want books you have.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <MessageSquare className="w-12 h-12 text-cf-dark-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chat & Exchange</h3>
              <p className="text-gray-600">
                Communicate with other users and arrange book exchanges seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;